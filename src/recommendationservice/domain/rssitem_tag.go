package domain

import "context"

type RSSItemTag struct {
	RSSItemID string `json:"rss_item_id" bson:"rss_item_id"`
	TagID     string `json:"tag_id" bson:"tag_id"`
}

type RSSItemTagRepository interface {
	CreateRSSItemTag(rssItemID, tagID string, ctx context.Context) (*RSSItemTag, error)
	GetRSSItemIDsByTagID(tagID string, ctx context.Context) ([]*RSSItem, error)
	GetTagsByRSSItemID(rssItemID string, ctx context.Context) ([]*Tag, error)
}
