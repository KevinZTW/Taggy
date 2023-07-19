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
	topicCollection *mongo.Collection
}

const (
	topicCollection = "topicCollection"
)

func NewMongo() *MongoRepository {
	db := mongodb.New()
	return &MongoRepository{
		topicCollection: db.Collection(topicCollection),
	}
}

func (m *MongoRepository) CreateTopic(name, description string, ctx context.Context) (*domain.Topic, error) {
	topic := domain.Topic{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
	}
	if _, err := m.topicCollection.InsertOne(ctx, topic); err != nil {
		return nil, err
	}
	return &topic, nil
}

func (m *MongoRepository) GetTopicByID(ID string, ctx context.Context) (*domain.Topic, error) {
	topic := &domain.Topic{}

	if err := m.topicCollection.FindOne(ctx, bson.D{{"id", ID}}).Decode(topic); err != nil {
		return nil, err
	} else {

		return topic, nil
	}
}

func (m *MongoRepository) ListTopics(ctx context.Context) ([]*domain.Topic, error) {
	var topics []*domain.Topic
	if cur, err := m.topicCollection.Find(ctx, bson.D{}); err != nil {
		return nil, err
	} else if cur.All(ctx, &topics); err != nil {
		return nil, err
	} else {
		return topics, nil
	}
}

func (m *MongoRepository) UpdateTopicTags(topic *domain.Topic, ctx context.Context) (*domain.Topic, error) {
	filter := bson.D{{"id", topic.ID}}
	update := bson.M{
		"$set": bson.M{
			"tags": topic.Tags,
		},
	}
	if res, err := m.topicCollection.UpdateOne(ctx, filter, update); err != nil {
		return nil, err
	} else if res.MatchedCount != 1 {
		return nil, ErrTopicEntityAmount
	} else {
		return m.GetTopicByID(topic.ID, ctx)
	}

}
