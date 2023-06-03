package service

import (
	"context"
	"rssservice/domain/rss"
	pb "rssservice/genproto/taggy"
	"rssservice/kafka"
	"rssservice/util"
	"time"

	"rssservice/log"

	"github.com/Shopify/sarama"
	"github.com/mmcdole/gofeed"
	"go.opentelemetry.io/contrib/instrumentation/github.com/Shopify/sarama/otelsarama"
	"go.opentelemetry.io/otel"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
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
	service.KafkaProducerClient, err = kafka.CreateKafkaProducer([]string{service.kafkaBrokerSvcAddr}, log.Logger)

	if err != nil {
		log.Fatal(err)
	}
	return service
}

func (r *RSSService) UpdateSourceFromOrigin(sourceId string) error {
	if source, err := r.repository.GetSourceById(sourceId); err != nil {
		return err
	} else {
		feeds, err := source.GetOriginFeeds()
		if err != nil {
			return err
		}
		lastUpdatedAt := feeds[0].PublishedAt

		for _, feed := range feeds {
			if feed.PublishedAt.Before(source.LastFeedSyncedAt) || feed.PublishedAt.Equal(source.LastFeedSyncedAt) {
				log.Infof("Skip feed: %s %s", feed.Title, feed.PublishedAt)
				continue
			}

			if feed.PublishedAt.After(lastUpdatedAt) {
				lastUpdatedAt = feed.PublishedAt
			}

			if feed, err := r.repository.CreateFeedFromEntity(feed); err != nil {
				log.Errorf("Failed to create feed: %v", err)
			} else {
				log.Infof("Created feed: %s %s", feed.Title, feed.PublishedAt)
			}
		}

		r.repository.UpdateSourceLastFeedSyncedAt(source, lastUpdatedAt)
		return nil
	}
}

func (r *RSSService) CreateSource(url string) (*rss.Source, error) {
	if source, err := r.parseURL(url); err != nil {
		return nil, err
	} else if existedSource, _ := r.getSourceByURL(source.URL); existedSource != nil {
		return existedSource, nil
	} else if source, err := r.createSourceFromEntity(source); err != nil {
		return nil, err
	} else {
		return source, nil
	}
}

func (r *RSSService) ListSources() ([]*rss.Source, error) {
	return r.repository.ListSources()
}

func (r *RSSService) parseURL(url string) (*rss.Source, error) {
	s := &rss.Source{}
	fp := gofeed.NewParser()

	if feed, err := fp.ParseURL(url); err != nil {
		return nil, err
	} else {
		// TODO: store more info to the RSS Source
		s.Name = feed.Title
		s.URL = feed.FeedLink
		s.Description = feed.Description
		s.LastFeedUpdatedAt = *feed.UpdatedParsed
		return s, nil
	}
}

func (r *RSSService) sendNewFeedEvent(ctx context.Context, feed *rss.Feed) {
	pbFeed := &pb.RSSFeed{
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
		Topic: kafka.Topic,
		Value: sarama.ByteEncoder(message),
	}

	otel.GetTextMapPropagator().Inject(ctx, otelsarama.NewProducerMessageCarrier(&msg))

	r.KafkaProducerClient.Input() <- &msg
	successMsg := <-r.KafkaProducerClient.Successes()
	log.Infof("Successful to write message. offset: %v", successMsg.Offset)
}

func (r *RSSService) createSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Source, error) {
	return r.repository.CreateSource(name, description, url, imgUrl, lastUpdatedAt)
}

func (r *RSSService) createSourceFromEntity(source *rss.Source) (*rss.Source, error) {
	return r.createSource(source.Name, source.Description, source.URL, source.ImgURL, source.LastFeedUpdatedAt)
}

func (r *RSSService) getSourceByURL(url string) (*rss.Source, error) {
	return r.repository.GetSourceByURL(url)
}
