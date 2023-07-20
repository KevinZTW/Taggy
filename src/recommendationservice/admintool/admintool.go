package admintool

import (
	"context"
	"recommendationservice/log"
	tagrepository "recommendationservice/tag/repository"
	tagservice "recommendationservice/tag/service"
	topicrepository "recommendationservice/topic/repository"
	topicservice "recommendationservice/topic/service"
)

type AdminTool struct {
	TagService   *tagservice.TagService
	TopicService *topicservice.TopicService
}

func New() *AdminTool {
	tagSrv := tagservice.NewTagService(tagrepository.NewMongo())
	topicSrc := topicservice.NewTopicService(topicrepository.NewMongo(), tagSrv)

	return &AdminTool{
		TagService:   tagSrv,
		TopicService: topicSrc,
	}
}

func (a *AdminTool) AddTagsToBackendTopic() {
	topic, err := a.TopicService.GetTopicByID("e7c95409-be1c-44c7-8ad0-fd6c94130545", context.Background())

	if err != nil {
		panic(err)
	}

	log.Infof("topic: %+v", topic)

	keywords := []string{
		"後端",
		"後端工程師",
		"系統監測",
		"作業系統",
		"分散式系統",
		"分散式",
		"一至性",
		"網路",
		"網路安全",
		"網路協定",
		"網路架構",
		"快取",
		"資料庫",
		"資料庫設計",
		"K8S",
		"Kubernetes",
		"Kafka",
		"Zipkin",
		"Prometheus",
		"Redis",
		"Mongo",
		"Postgre",
	}

	for _, keyword := range keywords {
		tag, err := a.TagService.CreateTag(keyword, nil)
		if err == tagservice.ErrTagAlreadyExists {
			log.Infof("tag %s already exists", keyword)
		} else if err != nil {
			panic(err)
		}
		if topic, err := a.TopicService.AddTagToTopic(tag.ID, topic.ID, context.Background()); err != nil {
			log.Errorf("failed to add tag %s to topic %s", tag.ID, err)
		} else {
			log.Infof("topic: %+v", topic)
		}

	}
}
