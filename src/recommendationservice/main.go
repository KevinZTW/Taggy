package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"recommendationservice/analysis"
	"recommendationservice/server"
	"recommendationservice/telementry"
	"syscall"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	fmt.Println("Tagging Service v0.0 !")

	// admin := admintool.New()
	// admin.AddTagsToBackendTopic()

	ch := make(chan os.Signal, 1)
	telementry.Init()
	serv := server.NewGRPCServer()
	go func() {
		err := serv.Run()
		log.Fatal(err)
	}()
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	// ---------------
	analyzer, _ := analysis.NewAnalyzer()
	analyzer.StartConsumerGroup(ctx)
	// ---------------

	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	fmt.Println("Graceful Shutdown start")
	<-ctx.Done()
	telementry.Shutdown()
}
