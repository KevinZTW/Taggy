package domain

import (
	"fmt"
	"time"

	"github.com/mmcdole/gofeed"
	log "github.com/sirupsen/logrus"
)

// Repository Data access interface
type Repository interface {
	CreateSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*Source, error)
	ListSources() ([]*Source, error)
	GetSourceByURL(url string) (*Source, error)
	GetSourceById(id string) (*Source, error)
	UpdateSourceLastItemSyncedAt(source *Source, syncedAt time.Time) error

	CreateItemFromEntity(item *Item) (*Item, error)
	ListSourceItems(source *Source) ([]*Item, error)
	GetItemByID(id string) (*Item, error)
	GetItemsBySourceID(sourceID int) ([]*Item, error)
}

type Source struct {
	ID                string    `bson:"id" json:"id"`
	Name              string    `bson:"name" json:"name"`
	Description       string    `bson:"description" json:"description"`
	URL               string    `bson:"url" json:"url"`
	ImgURL            string    `bson:"img_url" json:"img_url"`
	LastItemUpdatedAt time.Time `bson:"last_item_updated_at" json:"last_item_updated_at"`
	LastItemSyncedAt  time.Time `bson:"last_item_synced_at" json:"last_item_synced_at"`
}

func (s *Source) UpdateFromOrigin(repository Repository) error {

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

func (s *Source) GetOriginFeedItems() ([]*Item, error) {
	fp := gofeed.NewParser()
	items := []*Item{}
	if feed, err := fp.ParseURL(s.URL); err != nil {
		return nil, err
	} else {
		for _, item := range feed.Items {
			items = append(items, &Item{
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
	return items, nil
}

// CURD methods

func (s *Source) UpdateLastItemSyncedAt(repository Repository, syncedAt time.Time) error {
	return repository.UpdateSourceLastItemSyncedAt(s, syncedAt)
}

func (s *Source) ListAllItems(repository Repository) {
	items, _ := repository.ListSourceItems(s)
	fmt.Println(items)
}

func (s *Source) CreateItem(repository Repository, item *Item) {
	item.SourceId = s.ID
	repository.CreateItemFromEntity(item)
}

type Item struct {
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
