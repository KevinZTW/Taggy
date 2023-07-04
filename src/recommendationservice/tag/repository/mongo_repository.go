package repository

import (
	"recommendationservice/domain"
	"recommendationservice/mongodb"

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

func (m *MongoRepository) CreateTag(name string) (*domain.Tag, error) {
	tag := domain.Tag{
		ID:   uuid.New().String(),
		Name: name,
	}
	if _, err := m.tagCollection.InsertOne(nil, tag); err != nil {
		return nil, err
	}
	return &tag, nil
}
