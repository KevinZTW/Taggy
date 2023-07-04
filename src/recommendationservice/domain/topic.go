package domain

type Topic struct {
	ID          string `bson:"id"`
	Name        string `bson:"name"`
	Description string `bson:"description"`
	Tags        []Tag  `bson:"tags"`
}

type TopicRepository interface {
	CreateTopic(name, description string) (*Topic, error)
	ListTopics() ([]*Topic, error)
}
