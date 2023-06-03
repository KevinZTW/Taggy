package main

import (
	"context"
	"fmt"
	"net"
	pb "rssservice/genproto/taggy"
	"rssservice/log"
	"rssservice/rss/repository"
	"rssservice/rss/service"
	"rssservice/util"

	_ "github.com/joho/godotenv/autoload"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type rssServiceServer struct {
	RssService *service.RSSService
	pb.UnimplementedRSSServiceServer
}

func NewRSSServiceServer() *rssServiceServer {
	repo := repository.NewMongo()
	return &rssServiceServer{
		RssService: service.NewRSSService(repo),
	}
}

func (r *rssServiceServer) FetchAllRSS(ctx context.Context, in *pb.FetchAllRSSRequest) (*pb.FetchAllRSSReply, error) {
	reply := &pb.FetchAllRSSReply{
		Message: "TODO: FetchAllRSS",
	}
	return reply, nil
}

func (r *rssServiceServer) CreateRSSSource(ctx context.Context, in *pb.CreateRSSSourceRequest) (*pb.CreateRSSSourceReply, error) {
	if source, err := r.RssService.CreateSource(in.GetUrl()); err != nil {
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
		return reply, nil
	}
}

func (r *rssServiceServer) ListRSSSources(ctx context.Context, in *pb.ListRSSSourcesRequest) (*pb.ListRSSSourcesReply, error) {
	reply := &pb.ListRSSSourcesReply{}
	if sources, err := r.RssService.ListSources(); err != nil {
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

func main() {
	server := NewRSSServiceServer()
	var port string
	var err error
	util.MustMapEnv(&port, "RSS_SERVICE_PORT")

	fmt.Println("port: ", port)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}
	var opts []grpc.ServerOption
	var srv = grpc.NewServer(opts...)
	pb.RegisterRSSServiceServer(srv, server)

	server.RssService.UpdateSourceFromOrigin("92ae0555-7f60-4821-8fe9-e30b6a5b1797")

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	err = srv.Serve(lis)
	log.Fatal(err)
}
