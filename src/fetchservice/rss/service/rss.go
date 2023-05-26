package service

import "fmt"
import "taggy-content-service/internal/pkg/domain/rss"

type RSSService struct{}

func NewRSSService() *RSSService {
	return &RSSService{}
}

func (r *RSSService) GetLatestFeeds(source *rss.Source) {
	fmt.Printf("fetching rss from the web\n")
}
