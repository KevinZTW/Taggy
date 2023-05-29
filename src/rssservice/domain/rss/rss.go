package rss

import (
	"fmt"
	"time"
)

// Repository Data access interface
// TODO: should I separate source repo and feed repo?
type Repository interface {
	AddSource(source *Source) error
	AddFeed(feed *Feed) error
	GetAllSourceFeeds(source *Source) ([]*Feed, error)
	GetFeedByGUID(guid string) (*Feed, error)
	GetFeedsBySourceId(sourceId int) ([]*Feed, error)
}

type Source struct {
	ID                int
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
	repository.AddFeed(feed)
}

func (s *Source) GetFeedByGUID(repository Repository, guid string) (*Feed, error) {
	return repository.GetFeedByGUID(guid)
}

func (s *Source) SyncLatestFeeds(repository Repository) {

}

type Feed struct {
	ID             int
	SourceId       int
	Title          string
	Content        string
	ContentSnippet string
	GUID           string
	PubDate        time.Time
	URL            string
}

// could place some core logic?
