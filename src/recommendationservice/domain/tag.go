package domain

import "context"

type Tag struct {
	ID             string `json:"id" bson:"id"`
	Name           string `json:"name" bson:"name"`
	NormalizedName string `json:"normalized_name" bson:"normalized_name"`
}

type TagRepository interface {
	CreateTag(name, normalizedName string, ctx context.Context) (*Tag, error)
	ListTags(ctx context.Context) ([]*Tag, error)
	GetTagByID(ID string, ctx context.Context) (*Tag, error)
	GetTagByNormalizedName(name string, ctx context.Context) (*Tag, error)
}
