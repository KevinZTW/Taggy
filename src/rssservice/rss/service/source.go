package service

import (
	"context"
	"errors"
	"fmt"
	"rssservice/domain/rss"
	"rssservice/log"
	"rssservice/telementry"
	"time"

	"github.com/mmcdole/gofeed"
	"go.opentelemetry.io/otel/attribute"
)

// ForceUpdateFromOrigin This is to support local dev only, which would fetch origin item and create it without checking the existence
func (r *RSSService) ForceUpdateFromOrigin(feedId string, ctx context.Context) error {
	var source *rss.Source
	var err error
	_, span := telementry.NewTracer().Start(ctx, "ForceUpdateSourceFromOrigin")
	defer span.End()

	if source, err = r.repository.GetSourceById(feedId); err != nil {
		return err
	}
	span.SetAttributes(
		attribute.String("app.feed.id", feedId),
		attribute.String("app.feed.name", source.Name),
	)
	items, err := source.GetOriginFeedItems()

	if err != nil {
		return err
	}
	lastUpdatedAt := items[0].PublishedAt
	itemCount := 0
	for _, item := range items {
		if item, err := r.repository.CreateItemFromEntity(item); err != nil {
			log.Errorf("Failed to create item: %v", err)
		} else {
			log.Infof("Created item: %s %s", item.Title, item.PublishedAt)
			r.sendNewRSSItemEvent(context.TODO(), item)
			itemCount++
			if item.PublishedAt.After(lastUpdatedAt) {
				lastUpdatedAt = item.PublishedAt
			}
		}
	}

	if err := r.repository.UpdateSourceLastItemSyncedAt(source, lastUpdatedAt); err != nil {
		log.Errorf(err.Error())
	}
	// POC tracing
	msg := fmt.Sprintf("Updated %d items for source %s", itemCount, feedId)
	span.AddEvent(msg)
	span.SetAttributes(
		attribute.Int("app.feed.items.count", itemCount),
	)

	return nil
}

func (r *RSSService) UpdateSourceFromOrigin(sourceId string, ctx context.Context) error {
	var source *rss.Source
	var err error
	_, span := telementry.NewTracer().Start(ctx, "UpdateSourceFromOrigin")
	defer span.End()

	if source, err = r.repository.GetSourceById(sourceId); err != nil {
		span.RecordError(err)
		return err
	}

	span.SetAttributes(
		attribute.String("app.feed.id", sourceId),
		attribute.String("app.feed.name", source.Name),
	)
	items, err := source.GetOriginFeedItems()

	if err != nil {
		return err
	}

	lastUpdatedAt := items[0].PublishedAt
	itemCount := 0
	for _, item := range items {
		if item.PublishedAt.Before(source.LastItemSyncedAt) || item.PublishedAt.Equal(source.LastItemSyncedAt) {
			log.Infof("Skip item: %s %s", item.Title, item.PublishedAt)
			continue
		}

		if item, err := r.repository.CreateItemFromEntity(item); err != nil {
			log.Errorf("Failed to create item: %v", err)
		} else {
			log.Infof("Created item: %s %s", item.Title, item.PublishedAt)
			r.sendNewRSSItemEvent(context.TODO(), item)
			itemCount++
			if item.PublishedAt.After(lastUpdatedAt) {
				lastUpdatedAt = item.PublishedAt
			}
		}
	}

	if err := r.repository.UpdateSourceLastItemSyncedAt(source, lastUpdatedAt); err != nil {
		log.Errorf(err.Error())
	}
	// POC tracing
	msg := fmt.Sprintf("Updated %d items for source %s", itemCount, sourceId)
	span.AddEvent(msg)
	span.SetAttributes(
		attribute.Int("app.rss.items.count", itemCount),
	)

	return nil
}

func (r *RSSService) CreateSource(url string) (*rss.Source, error) {
	if source, err := r.parseURL(url); err != nil {
		return nil, errors.Join(ErrSourceNotFound, err)
	} else if existedSource, _ := r.getSourceByURL(source.URL); existedSource != nil {
		return existedSource, nil
	} else if source, err := r.createSourceFromEntity(source); err != nil {
		return nil, errors.Join(ErrRepository, err)
	} else {
		return source, nil
	}
}

func (r *RSSService) GetSourceById(id string) (*rss.Source, error) {
	return r.repository.GetSourceById(id)
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
		s.LastItemUpdatedAt = *feed.UpdatedParsed
		s.ImgURL = imgURL
		return s, nil
	}
}

func (r *RSSService) createSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Source, error) {
	return r.repository.CreateSource(name, description, url, imgUrl, lastUpdatedAt)
}

func (r *RSSService) createSourceFromEntity(source *rss.Source) (*rss.Source, error) {
	return r.createSource(source.Name, source.Description, source.URL, source.ImgURL, source.LastItemUpdatedAt)
}

func (r *RSSService) getSourceByURL(url string) (*rss.Source, error) {
	return r.repository.GetSourceByURL(url)
}
