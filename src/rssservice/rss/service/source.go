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
	var feed *rss.Feed
	var err error
	_, span := telementry.NewTracer().Start(ctx, "ForceUpdateFeedFromOrigin")
	defer span.End()

	if feed, err = r.repository.GetFeedById(feedId); err != nil {
		return err
	}
	span.SetAttributes(
		attribute.String("app.feed.id", feedId),
		attribute.String("app.feed.name", feed.Name),
	)
	items, err := feed.GetOriginFeedItems()

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

	if err := r.repository.UpdateFeedLastItemSyncedAt(feed, lastUpdatedAt); err != nil {
		log.Errorf(err.Error())
	}
	// POC tracing
	msg := fmt.Sprintf("Updated %d items for feed %s", itemCount, feedId)
	span.AddEvent(msg)
	span.SetAttributes(
		attribute.Int("app.feed.items.count", itemCount),
	)

	return nil
}

func (r *RSSService) UpdateFeedFromOrigin(feedId string, ctx context.Context) error {
	var feed *rss.Feed
	var err error
	_, span := telementry.NewTracer().Start(ctx, "UpdateFeedFromOrigin")
	defer span.End()

	if feed, err = r.repository.GetFeedById(feedId); err != nil {
		span.RecordError(err)
		return err
	}

	span.SetAttributes(
		attribute.String("app.feed.id", feedId),
		attribute.String("app.feed.name", feed.Name),
	)
	items, err := feed.GetOriginFeedItems()

	if err != nil {
		return err
	}

	lastUpdatedAt := items[0].PublishedAt
	itemCount := 0
	for _, item := range items {
		if item.PublishedAt.Before(feed.LastItemSyncedAt) || item.PublishedAt.Equal(feed.LastItemSyncedAt) {
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

	if err := r.repository.UpdateFeedLastItemSyncedAt(feed, lastUpdatedAt); err != nil {
		log.Errorf(err.Error())
	}
	// POC tracing
	msg := fmt.Sprintf("Updated %d items for feed %s", itemCount, feedId)
	span.AddEvent(msg)
	span.SetAttributes(
		attribute.Int("app.rss.items.count", itemCount),
	)

	return nil
}

func (r *RSSService) CreateFeed(url string) (*rss.Feed, error) {
	if feed, err := r.parseURL(url); err != nil {
		return nil, errors.Join(ErrFeedNotFound, err)
	} else if existedFeed, _ := r.getFeedByURL(feed.URL); existedFeed != nil {
		return existedFeed, nil
	} else if feed, err := r.createFeedFromEntity(feed); err != nil {
		return nil, errors.Join(ErrRepository, err)
	} else {
		return feed, nil
	}
}

func (r *RSSService) GetFeedById(id string) (*rss.Feed, error) {
	return r.repository.GetFeedById(id)
}

func (r *RSSService) ListFeeds() ([]*rss.Feed, error) {
	return r.repository.ListFeeds()
}

func (r *RSSService) parseURL(url string) (*rss.Feed, error) {
	s := &rss.Feed{}
	fp := gofeed.NewParser()

	if feed, err := fp.ParseURL(url); err != nil {
		return nil, err
	} else {
		// TODO: store more info to the RSS Feed

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

func (r *RSSService) createFeed(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Feed, error) {
	return r.repository.CreateFeed(name, description, url, imgUrl, lastUpdatedAt)
}

func (r *RSSService) createFeedFromEntity(feed *rss.Feed) (*rss.Feed, error) {
	return r.createFeed(feed.Name, feed.Description, feed.URL, feed.ImgURL, feed.LastItemUpdatedAt)
}

func (r *RSSService) getFeedByURL(url string) (*rss.Feed, error) {
	return r.repository.GetFeedByURL(url)
}
