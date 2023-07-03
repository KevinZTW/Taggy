package repository

import (
	"context"
	"errors"
	"fmt"
	"rssservice/domain/rss"
	"rssservice/log"
	"rssservice/mongodb"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepository struct {
	feedCollection *mongo.Collection
	itemCollection *mongo.Collection
}

const (
	feedCollection = "RSSFeedCollection"
	itemCollection = "RSSItemCollection"
)

func NewMongo() *MongoRepository {
	db := mongodb.New()
	return &MongoRepository{
		feedCollection: db.Collection(feedCollection),
		itemCollection: db.Collection(itemCollection),
	}
}

func (m *MongoRepository) CreateFeed(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Feed, error) {
	feed := rss.Feed{
		ID:                uuid.New().String(),
		Name:              name,
		Description:       description,
		URL:               url,
		LastItemUpdatedAt: lastUpdatedAt,
		ImgURL:            imgUrl,
	}

	_, err := m.feedCollection.InsertOne(nil, feed)
	if err != nil {
		return nil, err
	}

	return &feed, nil
}

func (m *MongoRepository) GetFeedById(id string) (*rss.Feed, error) {
	var feed rss.Feed
	if err := m.feedCollection.FindOne(nil, bson.D{{"id", id}}).Decode(&feed); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.Join(fmt.Errorf("[repo] RSS Feed with id %s not found", id), err)
		}
		return nil, err
	} else {
		return &feed, nil
	}
}

func (m *MongoRepository) GetFeedByURL(url string) (*rss.Feed, error) {
	var feed rss.Feed
	if err := m.feedCollection.FindOne(nil, bson.D{{"url", url}}).Decode(&feed); err != nil {
		return nil, err
	} else {
		return &feed, nil
	}
}

func (m *MongoRepository) ListFeeds() ([]*rss.Feed, error) {
	var feeds []*rss.Feed
	if cur, err := m.feedCollection.Find(nil, bson.D{}); err != nil {
		return nil, err
	} else if err = cur.All(nil, &feeds); err != nil {
		return nil, err
	} else {
		return feeds, nil
	}
}

func (m *MongoRepository) UpdateFeedLastItemSyncedAt(feed *rss.Feed, syncedAt time.Time) error {
	if _, err := m.feedCollection.UpdateOne(nil, bson.D{{"id", feed.ID}}, bson.D{{"$set", bson.D{{"last_item_synced_at", syncedAt}}}}); err != nil {
		return err
	} else {
		return nil
	}
}

func (m *MongoRepository) ListFeedItems(feed *rss.Feed) ([]*rss.Item, error) {
	items := []*rss.Item{}
	if cur, err := m.itemCollection.Find(nil, bson.D{{"feed_id", feed.ID}}); err != nil {
		return nil, err
	} else if err = cur.All(nil, &items); err != nil {
		return nil, err
	} else {
		return items, nil
	}
}

func (m *MongoRepository) CreateItemFromEntity(item *rss.Item) (*rss.Item, error) {
	item.ID = uuid.New().String()
	if _, err := m.itemCollection.InsertOne(nil, item); err != nil {
		return nil, err
	} else {
		return item, nil
	}
}

func (m *MongoRepository) GetItemByID(id string) (*rss.Item, error) {
	item := &rss.Item{}
	if err := m.itemCollection.FindOne(context.TODO(), bson.D{{"id", id}}).Decode(item); err != nil {
		log.Errorf(err.Error())
		return nil, err
	} else {
		return item, nil
	}
}

func (m *MongoRepository) GetItemsByFeedID(feedId int) ([]*rss.Item, error) {
	panic("implement me")
}
