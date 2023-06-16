package domain

import (
	"fmt"
	"time"

	"github.com/mmcdole/gofeed"
	log "github.com/sirupsen/logrus"
)

type RSSRepository interface {
	CreateSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*Source, error)
	ListSources() ([]*Source, error)
	GetSourceByURL(url string) (*Source, error)
	GetSourceById(id string) (*Source, error)
	UpdateSourceLastFeedSyncedAt(source *Source, lastFeedSyncedAt time.Time) error

	CreateFeedFromEntity(feed *Feed) (*Feed, error)
	ListSourceFeeds(source *Source) ([]*Feed, error)
	GetFeedByGUID(guid string) (*Feed, error)
	GetFeedsBySourceId(sourceId int) ([]*Feed, error)
}

type Source struct {
	ID                string    `bson:"id" json:"id"`
	Name              string    `bson:"name" json:"name"`
	Description       string    `bson:"description" json:"description"`
	URL               string    `bson:"url" json:"url"`
	ImgURL            string    `bson:"img_url" json:"img_url"`
	LastFeedUpdatedAt time.Time `bson:"last_feed_updated_at" json:"last_feed_updated_at"`
	LastFeedSyncedAt  time.Time `bson:"last_feed_synced_at" json:"last_feed_synced_at"`
}

func (s *Source) UpdateFromOrigin(repository RSSRepository) error {

	feeds, err := s.GetOriginFeeds()
	if err != nil {
		return err
	}
	lastUpdatedAt := feeds[0].PublishedAt

	for _, feed := range feeds {
		if feed.PublishedAt.Before(s.LastFeedSyncedAt) || feed.PublishedAt.Equal(s.LastFeedSyncedAt) {
			log.Infof("Skip feed: %s %s", feed.Title, feed.PublishedAt)
			continue
		}

		if feed.PublishedAt.After(lastUpdatedAt) {
			lastUpdatedAt = feed.PublishedAt
		}

		if feed, err := repository.CreateFeedFromEntity(feed); err != nil {
			log.Errorf("Failed to create feed: %v", err)
		} else {
			log.Infof("Created feed: %s %s", feed.Title, feed.PublishedAt)
		}
	}

	s.UpdateLastFeedSyncedAt(repository, lastUpdatedAt)
	return nil
}

func (s *Source) GetOriginFeeds() ([]*Feed, error) {
	fp := gofeed.NewParser()
	feeds := []*Feed{}
	if feed, err := fp.ParseURL(s.URL); err != nil {
		return nil, err
	} else {
		for _, item := range feed.Items {
			feeds = append(feeds, &Feed{
				SourceId:    s.ID,
				Title:       item.Title,
				Content:     item.Content,
				Description: item.Description,
				GUID:        item.GUID,
				PublishedAt: *item.PublishedParsed,
				URL:         item.Link,
			})
		}
	}
	return feeds, nil
}

// CURD methods

func (s *Source) UpdateLastFeedSyncedAt(repository RSSRepository, lastFeedSyncedAt time.Time) error {
	return repository.UpdateSourceLastFeedSyncedAt(s, lastFeedSyncedAt)
}

func (s *Source) GetAllFeeds(repository RSSRepository) {
	feeds, _ := repository.ListSourceFeeds(s)
	fmt.Println(feeds)
}

func (s *Source) CreateFeed(repository RSSRepository, feed *Feed) {
	feed.SourceId = s.ID
	repository.CreateFeedFromEntity(feed)
}

func (s *Source) GetFeedByGUID(repository RSSRepository, guid string) (*Feed, error) {
	return repository.GetFeedByGUID(guid)
}

func (s *Source) SyncLatestFeeds(repository RSSRepository) {

}

type Feed struct {
	ID             string    `bson:"id" json:"id"`
	SourceId       string    `bson:"source_id" json:"source_id"`
	Title          string    `bson:"title" json:"title"`
	Content        string    `bson:"content" json:"content"`
	Description    string    `bson:"description" json:"description"`
	ContentSnippet string    `bson:"content_snippet" json:"content_snippet"`
	GUID           string    `bson:"guid" json:"guid"`
	URL            string    `bson:"url" json:"url"`
	PublishedAt    time.Time `bson:"published_at" json:"published_at"`
}
