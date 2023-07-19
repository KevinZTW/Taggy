package service

import (
	"context"
	"errors"
	"recommendationservice/domain"
	"recommendationservice/kafka"
	"recommendationservice/log"
	"recommendationservice/util"
	"strings"

	"go.mongodb.org/mongo-driver/mongo"

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
	if tag, err := t.repository.GetTagByID(ID, ctx); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrTagNotFound
		}
		return nil, err
	} else {
		return tag, nil
	}
}

// ListTags
func (t *TagService) ListTags(ctx context.Context) ([]*domain.Tag, error) {
	return t.repository.ListTags(ctx)
}

func (t *TagService) CreateTag(name string, ctx context.Context) (*domain.Tag, error) {

	normalizedName := normalizeName(name)
	if tag, _ := t.repository.GetTagByNormalizedName(normalizedName, ctx); tag != nil {
		return nil, ErrTagAlreadyExists
	}

	return t.repository.CreateTag(name, normalizedName, ctx)
}

func normalizeName(name string) string {
	name = strings.TrimSpace(strings.ToLower(name))
	name = strings.Join(strings.Fields(name), " ")
	return name
}
