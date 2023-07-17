package service

import (
	"context"
	"recommendationservice/domain"
	"recommendationservice/kafka"
	"recommendationservice/util"

	"recommendationservice/log"

	"github.com/Shopify/sarama"
)

type TagService struct {
	repository          domain.TagRepository
	kafkaBrokerSvcAddr  string
	KafkaProducerClient sarama.AsyncProducer
}

func NewTagService(repository domain.TagRepository) *TagService {
	var err error
	service := &TagService{
		repository: repository,
	}
	util.MustMapEnv(&service.kafkaBrokerSvcAddr, "KAFKA_SERVICE_ADDR")
	log.Infof("kafkaBrokerSvcAddr: %s", service.kafkaBrokerSvcAddr)
	service.KafkaProducerClient, err = kafka.CreateKafkaProducer([]string{service.kafkaBrokerSvcAddr}, log.Logger)

	if err != nil {
		log.Fatal(err)
	}
	return service
}

func (t *TagService) GetTagByID(ID string, ctx context.Context) (*domain.Tag, error) {
	return t.repository.GetTagByID(ID, ctx)
}
