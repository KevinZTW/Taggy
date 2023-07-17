package server

import (
	"context"
	"fmt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net"
	pb "recommendationservice/genproto/taggy"
	"recommendationservice/log"
	tagservice "recommendationservice/tag/service"
	topicservice "recommendationservice/topic/service"

	tagrepository "recommendationservice/tag/repository"
	topicrepository "recommendationservice/topic/repository"
	"recommendationservice/util"

	"google.golang.org/grpc"
)

type GRPCServer struct {
}

func NewGRPCServer() *GRPCServer {
	return &GRPCServer{}
}

func (g *GRPCServer) Run() error {
	taggingService := newgrpcRecommendationService()
	var port string
	var err error
	util.MustMapEnv(&port, "RECOMMENDATION_SERVICE_PORT")

	log.Infof("port: %s", port)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}
	var opts []grpc.ServerOption
	var srv = grpc.NewServer(opts...)
	pb.RegisterRecommendationServiceServer(srv, taggingService)

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	return srv.Serve(lis)

}

type grpcRecommendationService struct {
	TagService   *tagservice.TagService
	TopicService *topicservice.TopicService
	pb.UnimplementedRecommendationServiceServer
}

func newgrpcRecommendationService() *grpcRecommendationService {
	tagSrv := tagservice.NewTagService(tagrepository.NewMongo())
	topicSrc := topicservice.NewTopicService(topicrepository.NewMongo(), tagSrv)

	return &grpcRecommendationService{
		TagService:   tagSrv,
		TopicService: topicSrc,
	}
}

func (r *grpcRecommendationService) GetRSSItemTags(ctx context.Context, in *pb.GetRSSItemTagsRequest) (*pb.GetRSSItemTagsReply, error) {
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

func (r *grpcRecommendationService) CreateTag(ctx context.Context, in *pb.CreateTagRequest) (*pb.CreateTagReply, error) {
	if tag, err := r.TagService.CreateTag(in.GetName(), ctx); err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	} else {
		res := &pb.CreateTagReply{
			Tag: &pb.Tag{
				Id:   tag.ID,
				Name: tag.Name,
			},
		}
		return res, nil
	}
}

func (r *grpcRecommendationService) GetTagByID(ctx context.Context, in *pb.GetTagByIDRequest) (*pb.GetTagByIDReply, error) {
	if tag, err := r.TagService.GetTagByID(in.GetId(), ctx); err != nil {
		return nil, status.Errorf(codes.NotFound, err.Error())
	} else {
		res := &pb.GetTagByIDReply{
			Tag: &pb.Tag{
				Id:   tag.ID,
				Name: tag.Name,
			},
		}
		return res, nil
	}
}

func (r *grpcRecommendationService) ListTags(ctx context.Context, in *pb.ListTagsRequest) (*pb.ListTagsReply, error) {
	//TODO :implement
	return nil, status.Errorf(codes.Unimplemented, "to be implemented")
}

func (r *grpcRecommendationService) CreateTopic(ctx context.Context, in *pb.CreateTopicRequest) (*pb.CreateTopicReply, error) {
	//TODO :implement
	return nil, status.Errorf(codes.Unimplemented, "to be implemented")
}

func (r *grpcRecommendationService) AddTagToTopic(ctx context.Context, in *pb.AddTagToTopicRequest) (*pb.AddTagToTopicReply, error) {
	//TODO :implement
	return nil, status.Errorf(codes.Unimplemented, "to be implemented")
}

func (r *grpcRecommendationService) ListTopics(ctx context.Context, in *pb.ListTopicsRequest) (*pb.ListTopicsReply, error) {
	//TODO :implement
	return nil, status.Errorf(codes.Unimplemented, "to be implemented")
}
