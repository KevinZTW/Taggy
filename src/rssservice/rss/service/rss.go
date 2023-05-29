package service

import (
	"fmt"
	"rssservice/domain/rss"
	"rssservice/rss/repository"
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

func (r *RSSService) AddSource(source *rss.Source) {

}
