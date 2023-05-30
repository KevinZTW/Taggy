package rss

import (
	"fmt"
	"time"
)

// Repository Data access interface
// TODO: should I separate source repo and feed repo?
type Repository interface {
	CreateSource(name, description, url, imgUrl string, lastUpdatedAt time.Time) (*Source, error)
	ListSources() ([]*Source, error)
	CreateFeed(feed *Feed) (*Feed, error)

	GetAllSourceFeeds(source *Source) ([]*Feed, error)
	GetFeedByGUID(guid string) (*Feed, error)
	GetFeedsBySourceId(sourceId int) ([]*Feed, error)
}

type Source struct {
	ID                string
	Name              string
	Description       string
	URL               string
	LastFeedUpdatedAt time.Time
	ImgURL            string
}

func (s *Source) GetAllFeeds(repository Repository) {
	feeds, _ := repository.GetAllSourceFeeds(s)
	fmt.Println(feeds)
}

func (s *Source) AddFeed(repository Repository, feed *Feed) {
	feed.SourceId = s.ID
	repository.CreateFeed(feed)
}

func (s *Source) GetFeedByGUID(repository Repository, guid string) (*Feed, error) {
	return repository.GetFeedByGUID(guid)
}

func (s *Source) SyncLatestFeeds(repository Repository) {

}

type Feed struct {
	ID             string
	SourceId       string
	Title          string
	Content        string
	ContentSnippet string
	GUID           string
	PubDate        time.Time
	URL            string
}

// could place some core logic?
