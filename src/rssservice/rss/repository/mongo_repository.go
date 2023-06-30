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
	sourceCollection *mongo.Collection
	itemCollection   *mongo.Collection
}

const (
	sourceCollection = "RSSSourceCollection"
	itemCollection   = "RSSItemCollection"
)

func NewMongo() *MongoRepository {
	db := mongodb.New()
	return &MongoRepository{
		sourceCollection: db.Collection(sourceCollection),
		itemCollection:   db.Collection(itemCollection),
	}
}

func (m *MongoRepository) CreateSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Source, error) {
	source := rss.Source{
		ID:                uuid.New().String(),
		Name:              name,
		Description:       description,
		URL:               url,
		LastItemUpdatedAt: lastUpdatedAt,
		ImgURL:            imgUrl,
	}

	_, err := m.sourceCollection.InsertOne(nil, source)
	if err != nil {
		return nil, err
	}

	return &source, nil
}

func (m *MongoRepository) GetSourceById(id string) (*rss.Source, error) {
	var source rss.Source
	if err := m.sourceCollection.FindOne(nil, bson.D{{"id", id}}).Decode(&source); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.Join(fmt.Errorf("[repo] RSS Source with id %s not found", id), err)
		}
		return nil, err
	} else {
		return &source, nil
	}
}

func (m *MongoRepository) GetSourceByURL(url string) (*rss.Source, error) {
	var source rss.Source
	if err := m.sourceCollection.FindOne(nil, bson.D{{"url", url}}).Decode(&source); err != nil {
		return nil, err
	} else {
		return &source, nil
	}
}

func (m *MongoRepository) ListSources() ([]*rss.Source, error) {
	var sources []*rss.Source
	if cur, err := m.sourceCollection.Find(nil, bson.D{}); err != nil {
		return nil, err
	} else if err = cur.All(nil, &sources); err != nil {
		return nil, err
	} else {
		return sources, nil
	}
}

func (m *MongoRepository) UpdateSourceLastItemSyncedAt(source *rss.Source, syncedAt time.Time) error {
	if _, err := m.sourceCollection.UpdateOne(nil, bson.D{{"id", source.ID}}, bson.D{{"$set", bson.D{{"last_item_synced_at", syncedAt}}}}); err != nil {
		return err
	} else {
		return nil
	}
}

func (m *MongoRepository) ListSourceItems(source *rss.Source) ([]*rss.Item, error) {
	items := []*rss.Item{}
	if cur, err := m.itemCollection.Find(nil, bson.D{{"source_id", source.ID}}); err != nil {
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

func (m *MongoRepository) GetItemsBySourceID(sourceId int) ([]*rss.Item, error) {
	panic("implement me")
}
