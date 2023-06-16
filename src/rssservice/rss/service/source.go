package service

import (
	"context"
	"fmt"
	"rssservice/domain/rss"
	"rssservice/log"
	telemetry "rssservice/telementry"
	"time"

	"github.com/mmcdole/gofeed"
	"go.opentelemetry.io/otel/attribute"
)

func (r *RSSService) UpdateSourceFromOrigin(sourceId string) error {
	var source *rss.Source
	var err error
	_, span := telemetry.NewTracer().Start(context.TODO(), "UpdateSourceFromOrigin")
	defer span.End()
	if source, err = r.repository.GetSourceById(sourceId); err != nil {
		return err
	}
	feeds, err := source.GetOriginFeeds()

	if err != nil {
		return err
	}

	lastUpdatedAt := feeds[0].PublishedAt
	feedCount := 0
	for _, feed := range feeds {
		if feed.PublishedAt.Before(source.LastFeedSyncedAt) || feed.PublishedAt.Equal(source.LastFeedSyncedAt) {
			log.Infof("Skip feed: %s %s", feed.Title, feed.PublishedAt)
			continue
		}

		if feed, err := r.repository.CreateFeedFromEntity(feed); err != nil {
			log.Errorf("Failed to create feed: %v", err)
		} else {
			log.Infof("Created feed: %s %s", feed.Title, feed.PublishedAt)
			r.sendNewFeedEvent(context.TODO(), feed)
			feedCount++
			if feed.PublishedAt.After(lastUpdatedAt) {
				lastUpdatedAt = feed.PublishedAt
			}
		}
	}

	if err := r.repository.UpdateSourceLastFeedSyncedAt(source, lastUpdatedAt); err != nil {
		log.Errorf(err.Error())
	}
	// POC tracing
	msg := fmt.Sprintf("Updated %d feeds for source %s", feedCount, sourceId)
	span.AddEvent(msg)
	span.SetAttributes(
		attribute.Int("app.rss.feeds.count", feedCount),
	)

	return nil
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

		imgURL := ""
		if feed.Image != nil {
			imgURL = feed.Image.URL
		}

		s.Name = feed.Title
		s.URL = feed.FeedLink
		s.Description = feed.Description
		s.LastFeedUpdatedAt = *feed.UpdatedParsed
		s.ImgURL = imgURL
		return s, nil
	}
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
