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
	feedCollection   *mongo.Collection
}

const (
	sourceCollection = "RSSSourceCollection"
	feedCollection   = "RSSFeedCollection"
)

func NewMongo() *MongoRepository {
	db := mongodb.New()
	return &MongoRepository{
		sourceCollection: db.Collection(sourceCollection),
		feedCollection:   db.Collection(feedCollection),
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

func (m *MongoRepository) GetSourceById(id string) (*rss.Source, error) {
	var source rss.Source
	if err := m.sourceCollection.FindOne(nil, bson.D{{"id", id}}).Decode(&source); err != nil {
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

// implement UpdateSourceLastFeedSyncedAt
func (m *MongoRepository) UpdateSourceLastFeedSyncedAt(source *rss.Source, lastFeedSyncedAt time.Time) error {
	if _, err := m.sourceCollection.UpdateOne(nil, bson.D{{"id", source.ID}}, bson.D{{"$set", bson.D{{"last_feed_synced_at", lastFeedSyncedAt}}}}); err != nil {
		return err
	} else {
		return nil
	}
}

func (m *MongoRepository) ListSourceFeeds(source *rss.Source) ([]*rss.Feed, error) {
	feeds := []*rss.Feed{}
	if cur, err := m.feedCollection.Find(nil, bson.D{{"source_id", source.ID}}); err != nil {
		return nil, err
	} else if err = cur.All(nil, &feeds); err != nil {
		return nil, err
	} else {
		return feeds, nil
	}
}

func (m *MongoRepository) CreateFeedFromEntity(feed *rss.Feed) (*rss.Feed, error) {
	feed.ID = uuid.New().String()
	if _, err := m.feedCollection.InsertOne(nil, feed); err != nil {
		return nil, err
	} else {
		return feed, nil
	}
}

func (m *MongoRepository) GetFeedByGUID(guid string) (*rss.Feed, error) {
	panic("implement me")
}

func (m *MongoRepository) GetFeedsBySourceId(sourceId int) ([]*rss.Feed, error) {
	panic("implement me")
}
