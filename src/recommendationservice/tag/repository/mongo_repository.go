package repository

import (
	"context"
	"recommendationservice/domain"
	"recommendationservice/mongodb"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepository struct {
	tagCollection *mongo.Collection
}

const (
	tagCollection = "tagCollection"
)

func NewMongo() *MongoRepository {
	db := mongodb.New()
	return &MongoRepository{
		tagCollection: db.Collection(tagCollection),
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
