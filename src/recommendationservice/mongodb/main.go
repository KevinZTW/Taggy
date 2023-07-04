package mongodb

import (
	"context"
	"log"
	"recommendationservice/util"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	once          sync.Once
	mongoDatabase *mongo.Database
)

func New() *mongo.Database {
	once.Do(func() {
		var url, name string
		util.MustMapEnv(&url, "RECOMMENDATION_SERVICE_MONGODB_ADDR")
		util.MustMapEnv(&name, "RECOMMENDATION_SERVICE_MONGODB_NAME")

		if cli, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(url)); err != nil {
			log.Fatal(err)
		} else {
			mongoDatabase = cli.Database(name)
		}
	})
	return mongoDatabase
}
