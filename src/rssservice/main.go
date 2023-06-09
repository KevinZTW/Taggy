package main

import (
	"rssservice/log"
	"rssservice/server"

	_ "github.com/joho/godotenv/autoload"
)

func main() {

	// server.RssService.UpdateSourceFromOrigin("92ae0555-7f60-4821-8fe9-e30b6a5b1797")

	err := server.NewGRPCServer().Serve()

	log.Fatal(err)

}
