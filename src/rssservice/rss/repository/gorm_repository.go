package repository

import (
	"fmt"
	"rssservice/domain/rss"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type FeedModel struct {
	gorm.Model
	rss.Item
}

func (r *FeedModel) TableName() string {
	return "rss_items"
}

func (r *FeedModel) ToFeed() *rss.Item {
	return &r.Item
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
	items := []FeedModel{}
	db.Find(&items)

	return &RSSRepository{db: db}
}

func (r *RSSRepository) ListSourceItems(source *rss.Source) ([]*rss.Item, error) {
	panic("implement me")
}

func (r *RSSRepository) CreateFeed(feed rss.Item) error {
	r.db.Create(&FeedModel{Item: feed})
	return nil
}

func (r *RSSRepository) GetFeedByGUID(guid string) (*rss.Item, error) {
	panic("implement me")
}

func (r *RSSRepository) GetItemsBySourceId(sourceId int) ([]*rss.Item, error) {
	panic("implement me")
}
