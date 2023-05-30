package main

import (
	"context"
	"fmt"
	_ "github.com/joho/godotenv/autoload"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/timestamppb"
	"net"
	"os"
	pb "rssservice/genproto/taggy"
	"rssservice/rss/service"
	"rssservice/util"
	"time"
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
	pb.UnimplementedRSSServiceServer
	RssService *service.RSSService
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

func (s *rssServiceServer) AddRSSSource(ctx context.Context, in *pb.AddRSSSourceRequest) (*pb.AddRSSSourceReply, error) {
	req := in.GetSource()
	reply := &pb.AddRSSSourceReply{}

	if source, err := s.RssService.AddSource(req.Name, req.Description, "tmpurl", "tmpimg", time.Now()); err != nil {
		log.Errorf("failed to add source: %q", err)

		// TODO: when to return err and when to add err msg to reply?
		return nil, err
	} else {
		reply.Message = fmt.Sprintf("added source: %q", source)
		return reply, nil
	}
}

func (s *rssServiceServer) ListRSSSources(ctx context.Context, in *pb.ListRSSSourcesRequest) (*pb.ListRSSSourcesReply, error) {
	reply := &pb.ListRSSSourcesReply{}
	if sources, err := s.RssService.ListSources(); err != nil {
		log.Errorf("failed to list sources: %q", err)
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

func main() {
	var port string
	util.MustMapEnv(&port, "RSS_SERVICE_PORT")
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}
	var opts []grpc.ServerOption
	var srv = grpc.NewServer(opts...)
	pb.RegisterRSSServiceServer(srv, NewRSSServiceServer())

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	err = srv.Serve(lis)
	log.Fatal(err)
}
