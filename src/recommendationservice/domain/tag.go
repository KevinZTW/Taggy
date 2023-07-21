package domain

import "context"

type Tag struct {
	ID             string `json:"id" bson:"id"`
	Name           string `json:"name" bson:"name"`
	NormalizedName string `json:"normalized_name" bson:"normalized_name"`
}

type RSSItemTag struct {
	RSSItemID string `json:"rss_item_id" bson:"rss_item_id"`
	TagID     string `json:"tag_id" bson:"tag_id"`
}

type TagRepository interface {
	CreateTag(name, normalizedName string, ctx context.Context) (*Tag, error)
	ListTags(ctx context.Context) ([]*Tag, error)
	GetTagByID(ID string, ctx context.Context) (*Tag, error)
	GetTagByNormalizedName(name string, ctx context.Context) (*Tag, error)

	// RSSItemTag
	CreateRSSItemTag(rssItemID, tagID string, ctx context.Context) (*RSSItemTag, error)
	GetRSSItemIDsByTagID(tagID string, ctx context.Context) ([]string, error)
	GetTagsByRSSItemID(rssItemID string, ctx context.Context) ([]*Tag, error)
}

//TODO: Design system to handle Tag Alias and Tag Synonym
// e.g. "K8S" -> "Kubernetes" "Backend", "Backend Engineer" -> "後端" , "後端工程師"
