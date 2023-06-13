package service

import (
	"taggingservice/domain"
	"taggingservice/kafka"
	"taggingservice/util"

	"taggingservice/log"

	"github.com/Shopify/sarama"
)

type TaggingService struct {
	repository          domain.TagRepository
	kafkaBrokerSvcAddr  string
	KafkaProducerClient sarama.AsyncProducer
}

func NewTaggingService(repository domain.TagRepository) *TaggingService {
	var err error
	service := &TaggingService{
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
