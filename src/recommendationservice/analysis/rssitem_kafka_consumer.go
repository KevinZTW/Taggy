package analysis

import (
	"context"
	"fmt"
	"recommendationservice/genproto/taggy"
	"recommendationservice/kafka"
	"recommendationservice/log"
	"recommendationservice/util"
	"strings"

	"github.com/sirupsen/logrus"
	"google.golang.org/protobuf/proto"

	"github.com/Shopify/sarama"
)

type groupHandler struct {
	log      *logrus.Logger
	analyzer *Analyzer
}

func (g *groupHandler) Setup(session sarama.ConsumerGroupSession) error {
	log.Infof("Setup\n")
	log.Infof("%+v", session.Claims())

	return nil
}

func (g *groupHandler) Cleanup(_ sarama.ConsumerGroupSession) error {
	return nil
}

func (g *groupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for {
		select {
		case message := <-claim.Messages():
			item := taggy.RSSItem{}
			err := proto.Unmarshal(message.Value, &item)
			if err != nil {
				return err
			}

			text := fmt.Sprintf("%s %s %s", item.Title, item.PlainTextContent, item.Description)
			log.Infof("text: %s", text)

			tags := g.analyzer.AnalyzeTags(text)
			for _, tag := range tags {
				log.Infof("Tag: %s", tag.Name)
				if _, err := g.analyzer.tagService.CreateRSSItemTag(item.Id, tag.ID, context.Background()); err != nil {
					log.Errorf("CreateRSSItemTag failed err: %s", err.Error())
				}
			}
			session.MarkMessage(message, "")

		case <-session.Context().Done():
			return nil
		}
	}
}

func (a *Analyzer) StartConsumerGroup(ctx context.Context) {
	var brokers string
	util.MustMapEnv(&brokers, "KAFKA_SERVICE_ADDR")

	log.Infof("Kafka addr: %s", brokers)

	brokerList := strings.Split(brokers, ",")
	log.Infof("Kafka brokers: %s", strings.Join(brokerList, ", "))

	groupHandler := &groupHandler{
		log:      log.Logger,
		analyzer: a,
	}

	if err := kafka.StartNewRSSItemConsumerGroup(ctx, brokerList, groupHandler); err != nil {
		log.Fatalf("StartNewRSSItemConsumerGroup failed err: %s", err.Error())
	}

}
