package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"recommendationservice/kafka"
	"recommendationservice/log"
	"recommendationservice/server"
	"recommendationservice/telementry"
	"recommendationservice/util"
	"strings"
	"syscall"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	fmt.Println("Tagging Service v0.0 !")
	ch := make(chan os.Signal, 1)
	telementry.Init()
	serv := server.NewGRPCServer()
	go func() {
		err := serv.Run()
		log.Fatal(err)
	}()

	// -- kafak POC --
	var brokers string
	util.MustMapEnv(&brokers, "KAFKA_SERVICE_ADDR")

	log.Infof("Kafka addr: %s", brokers)

	brokerList := strings.Split(brokers, ",")
	log.Infof("Kafka brokers: %s", strings.Join(brokerList, ", "))

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	if err := kafka.StartConsumerGroup(ctx, brokerList, log.Logger); err != nil {
		log.Fatalf("StartConsumerGroup failed err: %s", err.Error())
	}
	// ---------------

	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	fmt.Println("Graceful Shutdown start")
	<-ctx.Done()
	telementry.Shutdown()
}
