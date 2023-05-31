package main

import (
	"context"
	"fmt"
	"net"
	"os"
	pb "rssservice/genproto/taggy"
	"rssservice/kafka"
	"rssservice/rss/service"
	"rssservice/util"
	"time"

	"github.com/Shopify/sarama"
	_ "github.com/joho/godotenv/autoload"
	"github.com/sirupsen/logrus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/Shopify/sarama/otelsarama"
	"go.opentelemetry.io/otel"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var log *logrus.Logger

func init() {
	log = logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.JSONFormatter{
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
		},
		TimestampFormat: time.RFC3339Nano,
	}
	log.Out = os.Stdout
}

type rssServiceServer struct {
	RssService         *service.RSSService
	kafkaBrokerSvcAddr string
	pb.UnimplementedRSSServiceServer
	KafkaProducerClient sarama.AsyncProducer
}

func NewRSSServiceServer() *rssServiceServer {
	return &rssServiceServer{
		RssService: service.NewRSSService(),
	}
}

func (s *rssServiceServer) FetchAllRSS(ctx context.Context, in *pb.FetchAllRSSRequest) (*pb.FetchAllRSSReply, error) {
	reply := &pb.FetchAllRSSReply{
		Message: "TODO: FetchAllRSS",
	}
	return reply, nil
}

func (s *rssServiceServer) CreateRSSSource(ctx context.Context, in *pb.CreateRSSSourceRequest) (*pb.CreateRSSSourceReply, error) {
	if source, err := s.RssService.CreateSource(in.GetUrl()); err != nil {
		log.Errorf("failed to add source: %q", err)
		// TODO: implement the idea error handling ref: https://jbrandhorst.com/post/grpc-errors/
		return nil, err
	} else {
		reply := &pb.CreateRSSSourceReply{}
		reply.Source = &pb.RSSSource{
			Id:            source.ID,
			Name:          source.Name,
			Description:   source.Description,
			Url:           source.URL,
			ImgUrl:        source.ImgURL,
			LastUpdatedAt: timestamppb.New(source.LastFeedUpdatedAt),
		}
		s.sendToPostProcessor(context.TODO(), reply.Source)
		return reply, nil
	}
}

func (s *rssServiceServer) ListRSSSources(ctx context.Context, in *pb.ListRSSSourcesRequest) (*pb.ListRSSSourcesReply, error) {
	reply := &pb.ListRSSSourcesReply{}
	if sources, err := s.RssService.ListSources(); err != nil {
		log.Errorf("failed to list rss sources: %q", err)
		return nil, err
	} else {
		reply.RssSources = make([]*pb.RSSSource, len(sources))
		for i, source := range sources {
			reply.RssSources[i] = &pb.RSSSource{
				Name:          source.Name,
				Description:   source.Description,
				LastUpdatedAt: timestamppb.New(source.LastFeedUpdatedAt),
			}
		}
		return reply, nil
	}
}

func (cs *rssServiceServer) sendToPostProcessor(ctx context.Context, source *pb.RSSSource) {
	message, err := proto.Marshal(source)
	if err != nil {
		log.Errorf("Failed to marshal message to protobuf: %+v", err)
		return
	}

	// Inject tracing info into message
	msg := sarama.ProducerMessage{
		Topic: kafka.Topic,
		Value: sarama.ByteEncoder(message),
	}

	otel.GetTextMapPropagator().Inject(ctx, otelsarama.NewProducerMessageCarrier(&msg))

	cs.KafkaProducerClient.Input() <- &msg
	successMsg := <-cs.KafkaProducerClient.Successes()
	log.Infof("Successful to write message. offset: %v", successMsg.Offset)
}

func main() {
	server := NewRSSServiceServer()
	var port string
	var err error
	util.MustMapEnv(&port, "RSS_SERVICE_PORT")
	util.MustMapEnv(&server.kafkaBrokerSvcAddr, "KAFKA_SERVICE_ADDR")

	server.KafkaProducerClient, err = kafka.CreateKafkaProducer([]string{server.kafkaBrokerSvcAddr}, log)
	if err != nil {
		log.Fatal(err)
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}
	var opts []grpc.ServerOption
	var srv = grpc.NewServer(opts...)
	pb.RegisterRSSServiceServer(srv, server)

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	err = srv.Serve(lis)
	log.Fatal(err)
}
