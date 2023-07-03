package server

import (
	"context"
	"fmt"
	"net"
	pb "taggingservice/genproto/taggy"
	"taggingservice/log"
	"taggingservice/tag/service"
	"taggingservice/util"

	"google.golang.org/grpc"
)

type GRPCServer struct {
}

func NewGRPCServer() *GRPCServer {
	return &GRPCServer{}
}

func (g *GRPCServer) Run() error {
	taggingService := newgrpcTaggingService()
	var port string
	var err error
	util.MustMapEnv(&port, "TAGGING_SERVICE_PORT")

	log.Infof("port: %s", port)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}
	var opts []grpc.ServerOption
	var srv = grpc.NewServer(opts...)
	pb.RegisterTaggingServiceServer(srv, taggingService)

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	return srv.Serve(lis)

}

type grpcTaggingService struct {
	TaggingService *service.TaggingService
	pb.UnimplementedTaggingServiceServer
}

func newgrpcTaggingService() *grpcTaggingService {
	// repo := repository.NewMongo()
	return &grpcTaggingService{
		// RSSService: service.NewRSSService(repo),
	}

}

func (r *grpcTaggingService) GetRSSItemTags(ctx context.Context, in *pb.GetRSSItemTagsRequest) (*pb.GetRSSItemTagsReply, error) {
	reply := &pb.GetRSSItemTagsReply{}
	itemId := in.GetItemId()
	log.Infof("Receive request to get tags for item %s", itemId)
	reply.Tags = append(reply.Tags, &pb.Tag{Id: "0", Name: "backend"})

	return reply, nil

	//if feeds, err := r.RSSService.ListFeeds(); err != nil {
	//	reply.Message = err.Error()
	//	return reply, err
	//} else {
	//
	//	wg := sync.WaitGroup{}
	//	for _, feed := range feeds {
	//		wg.Add(1)
	//		go func(feed *rss.Feed) {
	//			defer wg.Done()
	//			if err := r.RSSService.UpdateFeedFromOrigin(feed.ID); err != nil {
	//				log.Errorf("failed to update feed: %q", err)
	//			}
	//		}(feed)
	//	}
	//	reply.Message = "success"
	//	return reply, err
	//}
}
