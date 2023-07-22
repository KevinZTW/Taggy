package server

import (
	"context"
	"errors"
	"fmt"
	"net"
	pb "recommendationservice/genproto/taggy"
	"recommendationservice/log"
	tagservice "recommendationservice/tag/service"
	topicservice "recommendationservice/topic/service"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

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

	if tags, err := r.TagService.GetTagsByRSSItemID(itemId, ctx); err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	} else {
		for _, tag := range tags {
			reply.Tags = append(reply.Tags, &pb.Tag{
				Id:   tag.ID,
				Name: tag.Name,
			})
		}
	}

	return reply, nil
}

// TODO: admin level authorization check
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
	if tags, err := r.TagService.ListTags(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	} else {
		res := &pb.ListTagsReply{}
		for _, tag := range tags {
			res.Tags = append(res.Tags, &pb.Tag{
				Id:   tag.ID,
				Name: tag.Name,
			})
		}
		return res, nil
	}
}

// TODO: admin level authorization check
func (r *grpcRecommendationService) CreateTopic(ctx context.Context, in *pb.CreateTopicRequest) (*pb.CreateTopicReply, error) {
	if topic, err := r.TopicService.CreateTopic(in.GetName(), in.GetDescription(), ctx); err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	} else {
		res := &pb.CreateTopicReply{
			Topic: &pb.Topic{
				Id:          topic.ID,
				Name:        topic.Name,
				Description: topic.Description,
			},
		}
		return res, nil
	}
}

// TODO: admin level authorization check
func (r *grpcRecommendationService) AddTagToTopic(ctx context.Context, in *pb.AddTagToTopicRequest) (*pb.AddTagToTopicReply, error) {
	if topic, err := r.TopicService.AddTagToTopic(in.GetTagId(), in.GetTopicId(), ctx); err != nil {

		if errors.Is(err, tagservice.ErrTagNotFound) || errors.Is(err, topicservice.ErrTopicNotFound) {
			return nil, status.Errorf(codes.NotFound, err.Error())
		}
		return nil, status.Errorf(codes.Internal, err.Error())
	} else {
		res := &pb.AddTagToTopicReply{
			Topic: &pb.Topic{
				Id:          topic.ID,
				Name:        topic.Name,
				Description: topic.Description,
			},
		}
		for _, tag := range topic.Tags {
			res.Topic.Tags = append(res.Topic.Tags, &pb.Tag{
				Id:   tag.ID,
				Name: tag.Name,
			})
		}
		return res, nil
	}
}

func (r *grpcRecommendationService) ListTopics(ctx context.Context, in *pb.ListTopicsRequest) (*pb.ListTopicsReply, error) {
	if topics, err := r.TopicService.ListTopics(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	} else {
		res := &pb.ListTopicsReply{}
		for _, topic := range topics {
			pt := &pb.Topic{
				Id:          topic.ID,
				Name:        topic.Name,
				Description: topic.Description,
			}

			for _, tag := range topic.Tags {
				pt.Tags = append(pt.Tags, &pb.Tag{
					Id:   tag.ID,
					Name: tag.Name,
				})
			}

			res.Topics = append(res.Topics, pt)
		}
		return res, nil
	}
}
