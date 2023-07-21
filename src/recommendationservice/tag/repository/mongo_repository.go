package repository

import (
	"context"
	"log"
	"recommendationservice/domain"
	"recommendationservice/mongodb"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoRepository struct {
	tagCollection        *mongo.Collection
	rssItemTagCollection *mongo.Collection
}

const (
	tagCollection        = "tagCollection"
	rssItemTagCollection = "rssItemTagCollection"
)

func NewMongo() *MongoRepository {
	db := mongodb.New()
	repo := &MongoRepository{
		tagCollection:        db.Collection(tagCollection),
		rssItemTagCollection: db.Collection(rssItemTagCollection),
	}

	repo.setupIndex()
	return repo
}

func (m *MongoRepository) setupIndex() {
	// TODO: examine if this is the best way to create index
	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{"rss_item_id", 1},
			{"tag_id", 1},
		},
		Options: options.Index().SetUnique(true),
	}

	if name, err := m.rssItemTagCollection.Indexes().CreateOne(context.TODO(), indexModel); err != nil {
		log.Fatalf("create rssItemTagCollection index rss_item_id, tag_id failed err: %s", err.Error())
	} else {
		log.Printf("create rssItemTagCollection index rss_item_id, tag_id success name: %s", name)
	}

}

func (m *MongoRepository) CreateTag(name, normalizedName string, ctx context.Context) (*domain.Tag, error) {
	tag := domain.Tag{
		ID:             uuid.New().String(),
		Name:           name,
		NormalizedName: normalizedName,
	}
	if _, err := m.tagCollection.InsertOne(nil, tag); err != nil {
		return nil, err
	}
	return &tag, nil
}

func (m *MongoRepository) GetTagByID(ID string, ctx context.Context) (*domain.Tag, error) {
	tag := &domain.Tag{}

	cur := m.tagCollection.FindOne(ctx, bson.D{{"id", ID}})
	if err := cur.Decode(tag); err != nil {
		return nil, err
	} else {
		return tag, nil
	}
}

func (m *MongoRepository) ListTags(ctx context.Context) ([]*domain.Tag, error) {
	var tags []*domain.Tag

	if cur, err := m.tagCollection.Find(ctx, bson.D{}); err != nil {
		return nil, err
	} else if err = cur.All(ctx, &tags); err != nil {
		return nil, err
	} else {
		return tags, nil
	}
}

func (m *MongoRepository) GetTagByNormalizedName(name string, ctx context.Context) (*domain.Tag, error) {
	tag := &domain.Tag{}

	cur := m.tagCollection.FindOne(ctx, bson.D{{"normalized_name", name}})

	if err := cur.Decode(tag); err != nil {
		return nil, err
	} else {
		return tag, nil
	}
}

func (m *MongoRepository) CreateRSSItemTag(rssItemID, tagID string, ctx context.Context) (*domain.RSSItemTag, error) {
	itemTag := domain.RSSItemTag{
		RSSItemID: rssItemID,
		TagID:     tagID,
	}

	if _, err := m.rssItemTagCollection.InsertOne(ctx, itemTag); err != nil {
		return nil, err
	} else {
		return &itemTag, nil
	}
}
func (m *MongoRepository) GetRSSItemIDsByTagID(tagID string, ctx context.Context) ([]string, error) {
	var rssItemIDs []string
	var rssItemTags []*domain.RSSItemTag

	if cur, err := m.rssItemTagCollection.Find(ctx, bson.D{{"tag_id", tagID}}); err != nil {
		return nil, err
	} else if err = cur.All(ctx, &rssItemTags); err != nil {
		return nil, err
	} else {
		for _, itemTag := range rssItemTags {
			rssItemIDs = append(rssItemIDs, itemTag.RSSItemID)
		}
		return rssItemIDs, nil
	}
}
func (m *MongoRepository) GetTagsByRSSItemID(rssItemID string, ctx context.Context) ([]*domain.Tag, error) {
	var tagIDs []string
	var rssItemTags []*domain.RSSItemTag
	var tags []*domain.Tag

	if cur, err := m.rssItemTagCollection.Find(ctx, bson.D{{"rss_item_id", rssItemID}}); err != nil {
		return nil, err
	} else if err = cur.All(ctx, &rssItemTags); err != nil {
		return nil, err
	} else {
		for _, itemTag := range rssItemTags {
			tagIDs = append(tagIDs, itemTag.TagID)
		}
		for _, tagID := range tagIDs {
			if tag, err := m.GetTagByID(tagID, ctx); err != nil {
				return nil, err
			} else {
				tags = append(tags, tag)
			}
		}
		return tags, nil
	}
}
