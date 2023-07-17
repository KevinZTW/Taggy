package domain

import "context"

type Topic struct {
	ID          string `bson:"id"`
	Name        string `bson:"name"`
	Description string `bson:"description"`
	Tags        []Tag  `bson:"tags"`
}

type TopicRepository interface {
	CreateTopic(name, description string, ctx context.Context) (*Topic, error)
	ListTopics(ctx context.Context) ([]*Topic, error)
	GetTopicByID(ID string, ctx context.Context) (*Topic, error)
	UpdateTopicTags(topic *Topic, ctx context.Context) (*Topic, error)
}
