package domain

import (
	"fmt"
	"time"

	"github.com/mmcdole/gofeed"
	log "github.com/sirupsen/logrus"
)

// Repository Data access interface
type Repository interface {
	CreateFeed(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*Feed, error)
	ListFeeds() ([]*Feed, error)
	GetFeedByURL(url string) (*Feed, error)
	GetFeedById(id string) (*Feed, error)
	UpdateFeedLastItemSyncedAt(source *Feed, syncedAt time.Time) error

	CreateItemFromEntity(item *Item) (*Item, error)
	ListFeedItems(source *Feed) ([]*Item, error)
	GetItemByID(id string) (*Item, error)
	GetItemsByFeedID(sourceID int) ([]*Item, error)
}

type Feed struct {
	ID                string    `bson:"id" json:"id"`
	Name              string    `bson:"name" json:"name"`
	Description       string    `bson:"description" json:"description"`
	URL               string    `bson:"url" json:"url"`
	ImgURL            string    `bson:"img_url" json:"img_url"`
	LastItemUpdatedAt time.Time `bson:"last_item_updated_at" json:"last_item_updated_at"`
	LastItemSyncedAt  time.Time `bson:"last_item_synced_at" json:"last_item_synced_at"`
}

func (s *Feed) UpdateFromOrigin(repository Repository) error {

	items, err := s.GetOriginFeedItems()
	if err != nil {
		return err
	}
	lastSyncedAt := items[0].PublishedAt

	for _, item := range items {
		if item.PublishedAt.Before(s.LastItemSyncedAt) || item.PublishedAt.Equal(s.LastItemSyncedAt) {
			log.Infof("Skip item: %s %s", item.Title, item.PublishedAt)
			continue
		}

		if item.PublishedAt.After(lastSyncedAt) {
			lastSyncedAt = item.PublishedAt
		}

		if item, err := repository.CreateItemFromEntity(item); err != nil {
			log.Errorf("Failed to create item: %v", err)
		} else {
			log.Infof("Created item: %s %s", item.Title, item.PublishedAt)
		}
	}

	s.UpdateLastItemSyncedAt(repository, lastSyncedAt)
	return nil
}

func (s *Feed) GetOriginFeedItems() ([]*Item, error) {
	fp := gofeed.NewParser()
	items := []*Item{}
	if feed, err := fp.ParseURL(s.URL); err != nil {
		return nil, err
	} else {
		for _, item := range feed.Items {
			items = append(items, &Item{
				FeedId:      s.ID,
				Title:       item.Title,
				Content:     item.Content,
				Description: item.Description,
				GUID:        item.GUID,
				PublishedAt: *item.PublishedParsed,
				URL:         item.Link,
			})
		}
	}
	return items, nil
}

// CURD methods

func (s *Feed) UpdateLastItemSyncedAt(repository Repository, syncedAt time.Time) error {
	return repository.UpdateFeedLastItemSyncedAt(s, syncedAt)
}

func (s *Feed) ListAllItems(repository Repository) {
	items, _ := repository.ListFeedItems(s)
	fmt.Println(items)
}

func (s *Feed) CreateItem(repository Repository, item *Item) {
	item.FeedId = s.ID
	repository.CreateItemFromEntity(item)
}

type Item struct {
	ID             string    `bson:"id" json:"id"`
	FeedId         string    `bson:"source_id" json:"source_id"`
	Title          string    `bson:"title" json:"title"`
	Content        string    `bson:"content" json:"content"`
	Description    string    `bson:"description" json:"description"`
	ContentSnippet string    `bson:"content_snippet" json:"content_snippet"`
	GUID           string    `bson:"guid" json:"guid"`
	URL            string    `bson:"url" json:"url"`
	PublishedAt    time.Time `bson:"published_at" json:"published_at"`
}
