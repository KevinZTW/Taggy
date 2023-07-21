package service

import (
	"context"
	"recommendationservice/domain"
)

func (t *TagService) CreateRSSItemTag(rssItemID, tagID string, ctx context.Context) (*domain.RSSItemTag, error) {
	return t.repository.CreateRSSItemTag(rssItemID, tagID, ctx)
}

func (t *TagService) GetRSSItemIDsByTagID(tagID string, ctx context.Context) ([]string, error) {
	return t.repository.GetRSSItemIDsByTagID(tagID, ctx)
}

func (t *TagService) GetTagsByRSSItemID(rssItemID string, ctx context.Context) ([]*domain.Tag, error) {
	return t.repository.GetTagsByRSSItemID(rssItemID, ctx)
}
