package mongodb

import (
	"context"
	"log"
	"rssservice/util"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	once          sync.Once
	mongoDatabase *mongo.Database
)

func New() *mongo.Database {

	var url, name string
	util.MustMapEnv(&url, "RSS_SERVICE_MONGODB_ADDR")
	util.MustMapEnv(&name, "RSS_SERVICE_MONGODB_NAME")

	once.Do(func() {
		if cli, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(url)); err != nil {
			log.Fatal(err)
		} else {
			mongoDatabase = cli.Database(name)
		}
	})
	return mongoDatabase
}
