package service

import (
	"context"
	"errors"
	"recommendationservice/domain"
	"recommendationservice/log"
	tagservice "recommendationservice/tag/service"
)

type TopicService struct {
	repository domain.TopicRepository
	tagService *tagservice.TagService
}

func NewTopicService(repository domain.TopicRepository, tagService *tagservice.TagService) *TopicService {
	var err error
	service := &TopicService{
		repository: repository,
		tagService: tagService,
	}
	if err != nil {
		log.Fatal(err)
	}
	return service
}

func (t *TopicService) GetTopicByID(ID string, ctx context.Context) (*domain.Topic, error) {
	return t.repository.GetTopicByID(ID, ctx)
}

func (t *TopicService) CreateTopic(name, description string, ctx context.Context) (*domain.Topic, error) {
	return t.repository.CreateTopic(name, description, ctx)
}

func (t *TopicService) ListTopics(ctx context.Context) ([]*domain.Topic, error) {
	return t.repository.ListTopics(ctx)
}

func (t *TopicService) AddTagToTopic(tagID string, topicID string, ctx context.Context) (*domain.Topic, error) {
	if tag, err := t.tagService.GetTagByID(tagID, ctx); err != nil {
		// TODO: create a error variable for this
		return nil, errors.New("tag not found")
	} else if topic, err := t.GetTopicByID(topicID, ctx); err != nil {
		return nil, err
	} else {
		for _, tag := range topic.Tags {
			if tag.ID == tagID {
				return topic, nil
			}
		}
		topic.Tags = append(topic.Tags, *tag)
		if topic, err := t.repository.UpdateTopicTags(topic, ctx); err != nil {
			return nil, err
		} else {
			return topic, err
		}
	}

}
