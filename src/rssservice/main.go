package main

import (
	"fmt"
	"os"
	"os/signal"
	"rssservice/log"
	"rssservice/server"
	"rssservice/telementry"
	"syscall"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	fmt.Println("RSS Service v0.0 !")
	ch := make(chan os.Signal, 1)
	telementry.Init()
	serv := server.NewGRPCServer()
	go func() {
		err := serv.Run()
		log.Fatal(err)
	}()

	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	fmt.Println("Graceful Shutdown start")
	telementry.Shutdown()
}
