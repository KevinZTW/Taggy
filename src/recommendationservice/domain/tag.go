package domain

import "context"

type Tag struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
}

type TagRepository interface {
	CreateTag(name string) (*Tag, error)
	ListTags() ([]*Tag, error)
	GetTagByID(ID string, ctx context.Context) (*Tag, error)
	GetTagByName(name string) (*Tag, error)
}
