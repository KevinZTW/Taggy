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

func (r *RSSService) ListSourceFeeds(sourceId string) ([]*rss.Feed, error) {
	if source, err := r.repository.GetSourceById(sourceId); err != nil {
		msg := fmt.Sprintf("[RSSService] can't find source with id %s", sourceId)
		log.Errorf(msg)
		return nil, errors.Join(err, errors.New(msg))
	} else if feeds, err := r.repository.ListSourceFeeds(source); err != nil {
		return nil, err
	} else {
		return feeds, nil
	}
}

func (r *RSSService) GetFeedById(id string) (*rss.Feed, error) {
	if feed, err := r.repository.GetFeedByID(id); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrFeedNotFound
		} else {
			return nil, errors.Join(ErrRepository, err)
		}
	} else {
		return feed, nil
	}
}

func (r *RSSService) sendNewRSSItemEvent(ctx context.Context, feed *rss.Feed) {
	pbFeed := &pb.RSSItem{
		Id:          feed.ID,
		SourceId:    feed.SourceId,
		Title:       feed.Title,
		Content:     feed.Content,
		Description: feed.Description,
		Url:         feed.URL,
		PublishedAt: timestamppb.New(feed.PublishedAt),
	}
	message, err := proto.Marshal(pbFeed)
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
