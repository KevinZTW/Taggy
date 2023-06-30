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
	feedId := in.GetId()
	log.Infof("Receive request to get tags for feed %s", feedId)
	reply.Tags = append(reply.Tags, &pb.Tag{Id: "0", Name: "backend"})

	return reply, nil

	//if sources, err := r.RSSService.ListSources(); err != nil {
	//	reply.Message = err.Error()
	//	return reply, err
	//} else {
	//
	//	wg := sync.WaitGroup{}
	//	for _, source := range sources {
	//		wg.Add(1)
	//		go func(source *rss.Source) {
	//			defer wg.Done()
	//			if err := r.RSSService.UpdateSourceFromOrigin(source.ID); err != nil {
	//				log.Errorf("failed to update source: %q", err)
	//			}
	//		}(source)
	//	}
	//	reply.Message = "success"
	//	return reply, err
	//}
}
