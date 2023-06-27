package server

import (
	"context"
	"errors"
	"fmt"
	"net"
	"rssservice/domain/rss"
	pb "rssservice/genproto/taggy"
	"rssservice/log"
	"rssservice/rss/repository"
	"rssservice/rss/service"
	"rssservice/telementry"
	"rssservice/util"
	"sync"

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
			LastUpdatedAt: timestamppb.New(source.LastFeedUpdatedAt),
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
			LastUpdatedAt: timestamppb.New(source.LastFeedUpdatedAt),
		}
		return reply, nil
	}
}

func (r *grpcRSSService) GetRSSFeed(ctx context.Context, in *pb.GetRSSFeedRequest) (*pb.GetRSSFeedReply, error) {
	if feed, err := r.RSSService.GetFeedById(in.GetFeedId()); err != nil {
		msg := fmt.Sprintf("GetRSSFeed failed with id: %s, err: %s", in.GetFeedId(), err.Error())
		log.Errorf(msg)
		if errors.Is(service.ErrSourceNotFound, err) {
			return nil, status.Errorf(codes.NotFound, msg)
		} else {
			return nil, status.Errorf(codes.Internal, msg)
		}

	} else {
		log.Infof("GetRSSFeed succeeded with id: %s")
		reply := &pb.GetRSSFeedReply{}
		f := &pb.RSSFeed{
			Id:          feed.ID,
			SourceId:    feed.SourceId,
			Title:       feed.Title,
			Content:     feed.Content,
			Description: feed.Description,
			Url:         feed.URL,
			PublishedAt: timestamppb.New(feed.PublishedAt),
		}
		reply.Feed = f
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
				LastUpdatedAt: timestamppb.New(source.LastFeedUpdatedAt),
			}
		}
		return reply, nil
	}
}

func (r *grpcRSSService) ListRSSSourceFeeds(ctx context.Context, in *pb.ListRSSSourceFeedsRequest) (*pb.ListRSSSourceFeedsReply, error) {
	reply := &pb.ListRSSSourceFeedsReply{}
	if feeds, err := r.RSSService.ListSourceFeeds(in.GetSourceId()); err != nil {
		return reply, err
	} else {
		for _, feed := range feeds {
			f := &pb.RSSFeed{
				Id:          feed.ID,
				SourceId:    feed.SourceId,
				Title:       feed.Title,
				Content:     feed.Content,
				Description: feed.Description,
				Url:         feed.URL,
				PublishedAt: timestamppb.New(feed.PublishedAt),
			}
			reply.Feeds = append(reply.Feeds, f)
		}
		return reply, nil
	}
}

// TODO: find a better naming

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
				if err := r.RSSService.UpdateSourceFromOrigin(source.ID); err != nil {
					log.Errorf("failed to update source: %q", err)
				}
			}(source)
		}
		reply.Message = "success"
		return reply, err
	}
}
