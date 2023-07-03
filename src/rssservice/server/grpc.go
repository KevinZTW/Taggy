package server

import (
	"context"
	"errors"
	"fmt"
	"go.opentelemetry.io/otel/trace"
	"net"
	"rssservice/domain/rss"
	pb "rssservice/genproto/taggy"
	"rssservice/log"
	"rssservice/rss/repository"
	"rssservice/rss/service"
	"rssservice/telementry"
	"rssservice/util"
	"sync"

	"github.com/golang/protobuf/ptypes/empty"

	_ "github.com/golang/protobuf/ptypes/empty"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type GRPCServer struct {
}

func NewGRPCServer() *GRPCServer {
	return &GRPCServer{}
}

func (g *GRPCServer) Run() error {
	RSSService := newgrpcRSSService()
	var port string
	var err error
	util.MustMapEnv(&port, "RSS_SERVICE_PORT")

	fmt.Println("port: ", port)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}

	telementry.Init()
	var srv = grpc.NewServer(
		grpc.UnaryInterceptor(otelgrpc.UnaryServerInterceptor()),
		grpc.StreamInterceptor(otelgrpc.StreamServerInterceptor()),
	)
	pb.RegisterRSSServiceServer(srv, RSSService)

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	return srv.Serve(lis)
}

type grpcRSSService struct {
	RSSService *service.RSSService
	pb.UnimplementedRSSServiceServer
}

func newgrpcRSSService() *grpcRSSService {
	repo := repository.NewMongo()
	return &grpcRSSService{
		RSSService: service.NewRSSService(repo),
	}
}

func (r *grpcRSSService) CreateRSSSource(ctx context.Context, in *pb.CreateRSSSourceRequest) (*pb.CreateRSSSourceReply, error) {
	if source, err := r.RSSService.CreateSource(in.GetUrl()); err != nil {
		msg := fmt.Sprintf("failed to add source for url:%s err: %q", in.GetUrl(), err)
		log.Errorf(msg)
		if errors.Is(service.ErrSourceNotFound, err) {
			return nil, status.Errorf(codes.NotFound, msg)
		} else {
			return nil, status.Errorf(codes.Internal, msg)
		}

	} else {
		reply := &pb.CreateRSSSourceReply{}
		reply.Source = &pb.RSSSource{
			Id:            source.ID,
			Name:          source.Name,
			Description:   source.Description,
			Url:           source.URL,
			ImgUrl:        source.ImgURL,
			LastUpdatedAt: timestamppb.New(source.LastItemUpdatedAt),
		}
		return reply, nil
	}
}

func (r *grpcRSSService) GetRSSSource(ctx context.Context, in *pb.GetRSSSourceRequest) (*pb.GetRSSSourceReply, error) {
	if source, err := r.RSSService.GetSourceById(in.GetSourceId()); err != nil {
		log.Errorf("failed to get source: %q", err)
		return nil, err
	} else {
		reply := &pb.GetRSSSourceReply{}
		reply.Source = &pb.RSSSource{
			Id:            source.ID,
			Name:          source.Name,
			Description:   source.Description,
			Url:           source.URL,
			ImgUrl:        source.ImgURL,
			LastUpdatedAt: timestamppb.New(source.LastItemUpdatedAt),
		}
		return reply, nil
	}
}

func (r *grpcRSSService) GetRSSItem(ctx context.Context, in *pb.GetRSSItemRequest) (*pb.GetRSSItemReply, error) {
	if item, err := r.RSSService.GetItemById(in.GetItemId()); err != nil {
		msg := fmt.Sprintf("GetRSSItem failed with id: %s, err: %s", in.GetItemId(), err.Error())
		log.Errorf(msg)
		if errors.Is(service.ErrSourceNotFound, err) {
			return nil, status.Errorf(codes.NotFound, msg)
		} else {
			return nil, status.Errorf(codes.Internal, msg)
		}

	} else {
		log.Infof("GetRSSItem succeeded with id: %s")
		reply := &pb.GetRSSItemReply{}
		it := &pb.RSSItem{
			Id:          item.ID,
			SourceId:    item.SourceId,
			Title:       item.Title,
			Content:     item.Content,
			Description: item.Description,
			Url:         item.URL,
			PublishedAt: timestamppb.New(item.PublishedAt),
		}
		reply.Item = it
		return reply, nil
	}

}

func (r *grpcRSSService) ListRSSSources(ctx context.Context, in *pb.ListRSSSourcesRequest) (*pb.ListRSSSourcesReply, error) {
	reply := &pb.ListRSSSourcesReply{}
	if sources, err := r.RSSService.ListSources(); err != nil {
		log.Errorf("failed to list rss sources: %q", err)
		return nil, err
	} else {
		reply.RssSources = make([]*pb.RSSSource, len(sources))
		for i, source := range sources {
			reply.RssSources[i] = &pb.RSSSource{
				Id:            source.ID,
				ImgUrl:        source.ImgURL,
				Url:           source.URL,
				Name:          source.Name,
				Description:   source.Description,
				LastUpdatedAt: timestamppb.New(source.LastItemUpdatedAt),
			}
		}
		return reply, nil
	}
}

func (r *grpcRSSService) ListRSSSourceItems(ctx context.Context, in *pb.ListRSSSourceItemsRequest) (*pb.ListRSSSourceItemsReply, error) {
	reply := &pb.ListRSSSourceItemsReply{}
	if items, err := r.RSSService.ListSourceItems(in.GetSourceId()); err != nil {
		return reply, err
	} else {
		for _, item := range items {
			f := &pb.RSSItem{
				Id:          item.ID,
				SourceId:    item.SourceId,
				Title:       item.Title,
				Content:     item.Content,
				Description: item.Description,
				Url:         item.URL,
				PublishedAt: timestamppb.New(item.PublishedAt),
			}
			reply.Items = append(reply.Items, f)
		}
		return reply, nil
	}
}

// TODO: refactor to a better naming, it's mechanism is to crawl origin RSS Source and create related entity in db

func (r *grpcRSSService) FetchAllRSS(ctx context.Context, in *pb.FetchAllRSSRequest) (*pb.FetchAllRSSReply, error) {
	reply := &pb.FetchAllRSSReply{}
	if sources, err := r.RSSService.ListSources(); err != nil {
		reply.Message = err.Error()
		return reply, err
	} else {

		wg := sync.WaitGroup{}
		for _, source := range sources {
			wg.Add(1)
			go func(source *rss.Source) {
				defer wg.Done()
				if err := r.RSSService.UpdateSourceFromOrigin(source.ID, ctx); err != nil {
					log.Errorf("failed to update source: %q", err)
				}
			}(source)
		}
		reply.Message = "success"
		return reply, err
	}
}

func (r *grpcRSSService) ForceFetchOriginItems(ctx context.Context, in *empty.Empty) (*empty.Empty, error) {
	reply := &empty.Empty{}
	span := trace.SpanFromContext(ctx)

	if sources, err := r.RSSService.ListSources(); err != nil {
		msg := "Failed to get RSS Sources" + err.Error()
		log.Errorf(msg)
		return reply, status.Error(codes.Internal, msg)
	} else {

		wg := sync.WaitGroup{}
		for _, source := range sources {
			wg.Add(1)
			go func(source *rss.Source) {
				defer wg.Done()
				if err := r.RSSService.ForceUpdateFromOrigin(source.ID, ctx); err != nil {
					msg := fmt.Sprint("Failed to update source: %q", err)
					log.Errorf(msg)
				}
			}(source)
		}
		wg.Wait()
		span.AddEvent("RSS Feed all updated")
		return reply, err
	}
}
