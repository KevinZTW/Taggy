package main

import (
	"context"
	"fmt"
	_ "github.com/joho/godotenv/autoload"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"net"
	"os"
	pb "rssservice/genproto/taggy"
	"rssservice/util"
	"time"
)

var log *logrus.Logger

func init() {
	log = logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.JSONFormatter{
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
		},
		TimestampFormat: time.RFC3339Nano,
	}
	log.Out = os.Stdout
}

type fetchServiceServer struct {
	pb.UnimplementedRSSServiceServer
}

func (s *fetchServiceServer) FetchAllRSS(ctx context.Context, in *pb.FetchAllRSSRequest) (*pb.FetchAllRSSReply, error) {
	reply := &pb.FetchAllRSSReply{
		Message: "TODO: FetchAllRSS",
	}
	return reply, nil
}

func main() {
	var port string
	util.MustMapEnv(&port, "RSS_SERVICE_PORT")
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}
	var opts []grpc.ServerOption
	var srv = grpc.NewServer(opts...)
	pb.RegisterRSSServiceServer(srv, &fetchServiceServer{})

	log.Infof("starting to listen on tcp: %q", lis.Addr().String())
	err = srv.Serve(lis)
	log.Fatal(err)
}
