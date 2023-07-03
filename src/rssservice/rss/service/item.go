package service

import (
	"context"
	"errors"
	"fmt"
	"rssservice/domain/rss"
	pb "rssservice/genproto/taggy"
	"rssservice/kafka"
	"rssservice/log"

	"go.mongodb.org/mongo-driver/mongo"

	"github.com/Shopify/sarama"
	"go.opentelemetry.io/contrib/instrumentation/github.com/Shopify/sarama/otelsarama"
	"go.opentelemetry.io/otel"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (r *RSSService) ListFeedItems(feedId string) ([]*rss.Item, error) {
	if feed, err := r.repository.GetFeedById(feedId); err != nil {
		msg := fmt.Sprintf("[RSSService] can't find feed with id %s", feedId)
		log.Errorf(msg)
		return nil, errors.Join(err, errors.New(msg))
	} else if items, err := r.repository.ListFeedItems(feed); err != nil {
		return nil, err
	} else {
		return items, nil
	}
}

func (r *RSSService) GetItemById(id string) (*rss.Item, error) {
	if item, err := r.repository.GetItemByID(id); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrItemNotFound
		} else {
			return nil, errors.Join(ErrRepository, err)
		}
	} else {
		return item, nil
	}
}

func (r *RSSService) sendNewRSSItemEvent(ctx context.Context, item *rss.Item) {
	pbItem := &pb.RSSItem{
		Id:          item.ID,
		FeedId:      item.FeedId,
		Title:       item.Title,
		Content:     item.Content,
		Description: item.Description,
		Url:         item.URL,
		PublishedAt: timestamppb.New(item.PublishedAt),
	}
	message, err := proto.Marshal(pbItem)
	if err != nil {
		log.Errorf("Failed to marshal message to protobuf: %+v", err)
		return
	}

	// Inject tracing info into message
	msg := sarama.ProducerMessage{
		Topic: kafka.NewRSSItemTopic,
		Value: sarama.ByteEncoder(message),
	}

	otel.GetTextMapPropagator().Inject(ctx, otelsarama.NewProducerMessageCarrier(&msg))

	r.KafkaProducerClient.Input() <- &msg
	successMsg := <-r.KafkaProducerClient.Successes()
	log.Infof("Successful to write message. offset: %v", successMsg.Offset)
}
