package service

import (
	"rssservice/domain/rss"
	"rssservice/kafka"
	"rssservice/util"

	"rssservice/log"

	"github.com/Shopify/sarama"
)

type RSSService struct {
	repository          rss.Repository
	kafkaBrokerSvcAddr  string
	KafkaProducerClient sarama.AsyncProducer
}

func NewRSSService(repository rss.Repository) *RSSService {
	var err error
	service := &RSSService{
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
