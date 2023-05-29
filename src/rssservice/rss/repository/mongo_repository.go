package repository

import (
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"rssservice/domain/rss"
	"rssservice/mongodb"
)

type MongoRepository struct {
	sourceCollection *mongo.Collection
}

const sourceCollection = "RSSSourceCollection"

func NewMongo() *MongoRepository {
	db := mongodb.New()
	return &MongoRepository{
		sourceCollection: db.Collection(sourceCollection),
	}
}

// implement interface

func (m *MongoRepository) AddSource(feed *rss.Source) error {
	fmt.Println("add source")
	return nil
}

func (m *MongoRepository) GetAllSourceFeeds(source *rss.Source) ([]*rss.Feed, error) {
	panic("implement me")
}

func (m *MongoRepository) AddFeed(feed *rss.Feed) error {
	panic("implement me")
}

func (m *MongoRepository) GetFeedByGUID(guid string) (*rss.Feed, error) {
	panic("implement me")
}

func (m *MongoRepository) GetFeedsBySourceId(sourceId int) ([]*rss.Feed, error) {
	panic("implement me")
}
