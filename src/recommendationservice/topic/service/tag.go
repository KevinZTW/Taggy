package service

import (
	"recommendationservice/domain"
	"recommendationservice/kafka"
	"recommendationservice/util"

	"recommendationservice/log"

	"github.com/Shopify/sarama"
)

type RecommendationService struct {
	repository          domain.TagRepository
	kafkaBrokerSvcAddr  string
	KafkaProducerClient sarama.AsyncProducer
}

func NewRecommendationService(repository domain.TagRepository) *RecommendationService {
	var err error
	service := &RecommendationService{
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
