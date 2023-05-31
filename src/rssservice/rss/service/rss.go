package service

import (
	"fmt"
	"rssservice/domain/rss"
	"rssservice/rss/repository"
	"time"

	"github.com/mmcdole/gofeed"
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

func (r *RSSService) CreateSource(url string) (*rss.Source, error) {
	if source, _ := r.getSourceByURL(url); source != nil {
		return source, nil
	} else if source, err := r.parseURL(url); err != nil {
		return nil, err
	} else if source, err := r.createSourceFromEntity(source); err != nil {
		return nil, err
	} else {
		return source, nil
	}
}

func (r *RSSService) ListSources() ([]*rss.Source, error) {
	return r.repository.ListSources()
}

func (r *RSSService) parseURL(url string) (*rss.Source, error) {
	s := &rss.Source{}
	fp := gofeed.NewParser()

	if feed, err := fp.ParseURL(url); err != nil {
		return nil, err
	} else {
		// TODO: store more info to the RSS Source
		s.Name = feed.Title
		s.URL = feed.FeedLink
		s.Description = feed.Description
		s.LastFeedUpdatedAt = *feed.UpdatedParsed
		return s, nil
	}
}

func (r *RSSService) createSourceFromEntity(source *rss.Source) (*rss.Source, error) {
	return r.createSource(source.Name, source.Description, source.URL, source.ImgURL, source.LastFeedUpdatedAt)
}

func (r *RSSService) createSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*rss.Source, error) {
	return r.repository.CreateSource(name, description, url, imgUrl, lastUpdatedAt)
}

func (r *RSSService) getSourceByURL(url string) (*rss.Source, error) {
	return r.repository.GetSourceByURL(url)
}
