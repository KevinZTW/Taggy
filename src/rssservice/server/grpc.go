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

	"go.opentelemetry.io/otel/trace"

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

func (r *grpcRSSService) CreateRSSFeed(ctx context.Context, in *pb.CreateRSSFeedRequest) (*pb.CreateRSSFeedReply, error) {
	if feed, err := r.RSSService.CreateFeed(in.GetUrl()); err != nil {
		msg := fmt.Sprintf("failed to add feed for url:%s err: %q", in.GetUrl(), err)
		log.Errorf(msg)
		if errors.Is(service.ErrFeedNotFound, err) {
			return nil, status.Errorf(codes.NotFound, msg)
		} else {
			return nil, status.Errorf(codes.Internal, msg)
		}

	} else {
		reply := &pb.CreateRSSFeedReply{}
		reply.Feed = &pb.RSSFeed{
			Id:            feed.ID,
			Name:          feed.Name,
			Description:   feed.Description,
			Url:           feed.URL,
			ImgUrl:        feed.ImgURL,
			LastUpdatedAt: timestamppb.New(feed.LastItemUpdatedAt),
		}
		return reply, nil
	}
}

func (r *grpcRSSService) GetRSSFeed(ctx context.Context, in *pb.GetRSSFeedRequest) (*pb.GetRSSFeedReply, error) {
	if feed, err := r.RSSService.GetFeedById(in.GetFeedId()); err != nil {
		log.Errorf("failed to get feed: %q", err)
		return nil, err
	} else {
		reply := &pb.GetRSSFeedReply{}
		reply.Feed = &pb.RSSFeed{
			Id:            feed.ID,
			Name:          feed.Name,
			Description:   feed.Description,
			Url:           feed.URL,
			ImgUrl:        feed.ImgURL,
			LastUpdatedAt: timestamppb.New(feed.LastItemUpdatedAt),
		}
		return reply, nil
	}
}

func (r *grpcRSSService) GetRSSItem(ctx context.Context, in *pb.GetRSSItemRequest) (*pb.GetRSSItemReply, error) {
	if item, err := r.RSSService.GetItemById(in.GetItemId()); err != nil {
		msg := fmt.Sprintf("GetRSSItem failed with id: %s, err: %s", in.GetItemId(), err.Error())
		log.Errorf(msg)
		if errors.Is(service.ErrFeedNotFound, err) {
			return nil, status.Errorf(codes.NotFound, msg)
		} else {
			return nil, status.Errorf(codes.Internal, msg)
		}

	} else {
		log.Infof("GetRSSItem succeeded with id: %s")
		reply := &pb.GetRSSItemReply{}
		it := &pb.RSSItem{
			Id:          item.ID,
			FeedId:      item.FeedId,
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

func (r *grpcRSSService) ListRSSItems(ctx context.Context, in *pb.ListRSSItemsRequest) (*pb.ListRSSItemsReply, error) {
	reply := &pb.ListRSSItemsReply{}
	if items, err := r.RSSService.ListItems(in.GetPage(), in.GetLimit()); err != nil {
		return reply, err
	} else {
		for _, item := range items {
			f := &pb.RSSItem{
				Id:          item.ID,
				FeedId:      item.FeedId,
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

func (r *grpcRSSService) ListRSSFeeds(ctx context.Context, in *pb.ListRSSFeedsRequest) (*pb.ListRSSFeedsReply, error) {
	reply := &pb.ListRSSFeedsReply{}
	if feeds, err := r.RSSService.ListFeeds(); err != nil {
		log.Errorf("failed to list rss feeds: %q", err)
		return nil, err
	} else {
		reply.Feeds = make([]*pb.RSSFeed, len(feeds))
		for i, feed := range feeds {
			reply.Feeds[i] = &pb.RSSFeed{
				Id:            feed.ID,
				ImgUrl:        feed.ImgURL,
				Url:           feed.URL,
				Name:          feed.Name,
				Description:   feed.Description,
				LastUpdatedAt: timestamppb.New(feed.LastItemUpdatedAt),
			}
		}
		return reply, nil
	}
}

func (r *grpcRSSService) ListRSSFeedItems(ctx context.Context, in *pb.ListRSSFeedItemsRequest) (*pb.ListRSSFeedItemsReply, error) {
	reply := &pb.ListRSSFeedItemsReply{}
	if items, err := r.RSSService.ListFeedItems(in.GetFeedId()); err != nil {
		return reply, err
	} else {
		for _, item := range items {
			f := &pb.RSSItem{
				Id:          item.ID,
				FeedId:      item.FeedId,
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

// TODO: refactor to a better naming, it's mechanism is to crawl origin RSS Feed and create related entity in db

func (r *grpcRSSService) FetchAllRSS(ctx context.Context, in *pb.FetchAllRSSRequest) (*pb.FetchAllRSSReply, error) {
	reply := &pb.FetchAllRSSReply{}
	if feeds, err := r.RSSService.ListFeeds(); err != nil {
		reply.Message = err.Error()
		return reply, err
	} else {

		wg := sync.WaitGroup{}
		for _, feed := range feeds {
			wg.Add(1)
			go func(feed *rss.Feed) {
				defer wg.Done()
				if err := r.RSSService.UpdateFeedFromOrigin(feed.ID, ctx); err != nil {
					log.Errorf("failed to update feed: %q", err)
				}
			}(feed)
		}
		reply.Message = "success"
		return reply, err
	}
}

func (r *grpcRSSService) ForceFetchOriginItems(ctx context.Context, in *empty.Empty) (*empty.Empty, error) {
	reply := &empty.Empty{}
	span := trace.SpanFromContext(ctx)

	if feeds, err := r.RSSService.ListFeeds(); err != nil {
		msg := "Failed to get RSS Feeds" + err.Error()
		log.Errorf(msg)
		return reply, status.Error(codes.Internal, msg)
	} else {

		wg := sync.WaitGroup{}
		for _, feed := range feeds {
			wg.Add(1)
			go func(feed *rss.Feed) {
				defer wg.Done()
				if err := r.RSSService.ForceUpdateFromOrigin(feed.ID, ctx); err != nil {
					msg := fmt.Sprint("Failed to update feed: %q", err)
					log.Errorf(msg)
				}
			}(feed)
		}
		wg.Wait()
		span.AddEvent("RSS Feed all updated")
		return reply, err
	}
}
