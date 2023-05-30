package service

import (
	"fmt"
	"rssservice/domain/rss"
	"rssservice/rss/repository"
	"time"
)

type RSSService struct {
	repository rss.Repository
}

func NewRSSService() *RSSService {
	return &RSSService{
		repository: repository.NewMongo(),
	}
}

func (r *RSSService) GetLatestFeeds(source *rss.Source) {
	fmt.Printf("fetching rss from the web\n")
}

func (r *RSSService) AddSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Source, error) {
	return r.repository.CreateSource(name, description, url, imgUrl, lastUpdatedAt)
}

func (r *RSSService) ListSources() ([]*rss.Source, error) {
	return r.repository.ListSources()
}
