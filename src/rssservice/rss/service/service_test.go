package service

import (
	"rssservice/rss/repository"
	"testing"

	"github.com/joho/godotenv"
)

func init() {
	//  for local testing, read the .env file in root directory
	godotenv.Load("../../.env")
}

func TestUpdateFeedFromOrigin(t *testing.T) {

	repo := repository.NewMongo()
	service := NewRSSService(repo)
	t.Run("TODO: UpdateFeedFromOrigin", func(t *testing.T) {
		service.UpdateFeedFromOrigin("92ae0555-7f60-4821-8fe9-e30b6a5b1797")
	})
}
