package repository

import (
	"fmt"
	"rssservice/domain/rss"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type FeedModel struct {
	gorm.Model
	rss.Feed
}

func (r *FeedModel) TableName() string {
	return "rss_feeds"
}

func (r *FeedModel) ToFeed() *rss.Feed {
	return &r.Feed
}

type RSSRepository struct {
	db *gorm.DB
}

func NewRSSRepository() *RSSRepository {
	dsn := "host=localhost user=kevinzhang dbname=taggy_development port=5432 sslmode=disable TimeZone=Asia/Taipei"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println(err)
	}
	db.AutoMigrate(&FeedModel{})
	feeds := []FeedModel{}
	db.Find(&feeds)

	return &RSSRepository{db: db}
}

func (r *RSSRepository) GetAllSourceFeeds(source *rss.Source) ([]*rss.Feed, error) {
	panic("implement me")
}

func (r *RSSRepository) CreateFeed(feed rss.Feed) error {
	r.db.Create(&FeedModel{Feed: feed})
	return nil
}

func (r *RSSRepository) GetFeedByGUID(guid string) (*rss.Feed, error) {
	panic("implement me")
}

func (r *RSSRepository) GetFeedsBySourceId(sourceId int) ([]*rss.Feed, error) {
	panic("implement me")
}
