package repository

import (
	"rssservice/domain/rss"
	"rssservice/mongodb"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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

func (m *MongoRepository) CreateSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Source, error) {
	source := rss.Source{
		ID:                uuid.New().String(),
		Name:              name,
		Description:       description,
		URL:               url,
		LastFeedUpdatedAt: lastUpdatedAt,
		ImgURL:            imgUrl,
	}

	_, err := m.sourceCollection.InsertOne(nil, source)
	if err != nil {
		return nil, err
	}

	return &source, nil
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

func (m *MongoRepository) GetAllSourceFeeds(source *rss.Source) ([]*rss.Feed, error) {
	panic("implement me")
}

func (m *MongoRepository) CreateFeed(feed *rss.Feed) (*rss.Feed, error) {
	panic("implement me")
}

func (m *MongoRepository) GetFeedByGUID(guid string) (*rss.Feed, error) {
	panic("implement me")
}

func (m *MongoRepository) GetFeedsBySourceId(sourceId int) ([]*rss.Feed, error) {
	panic("implement me")
}
