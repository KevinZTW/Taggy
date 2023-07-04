package kafka

import (
	"context"
	"log"
	"recommendationservice/genproto/taggy"

	"github.com/Shopify/sarama"
	"github.com/sirupsen/logrus"
	"go.opentelemetry.io/contrib/instrumentation/github.com/Shopify/sarama/otelsarama"
	"google.golang.org/protobuf/proto"
)

var (
	GroupID = "recommendationservice"
)

func StartConsumerGroup(ctx context.Context, brokers []string, log *logrus.Logger) error {
	saramaConfig := sarama.NewConfig()
	saramaConfig.Version = ProtocolVersion
	// So we can know the partition and offset of messages.
	saramaConfig.Producer.Return.Successes = true

	consumerGroup, err := sarama.NewConsumerGroup(brokers, GroupID, saramaConfig)
	if err != nil {
		return err
	}

	handler := groupHandler{
		log: log,
	}
	wrappedHandler := otelsarama.WrapConsumerGroupHandler(&handler)

	err = consumerGroup.Consume(ctx, []string{NewRSSItemTopic}, wrappedHandler)
	if err != nil {
		return err
	}
	return nil
}

type groupHandler struct {
	log *logrus.Logger
}

func (g *groupHandler) Setup(_ sarama.ConsumerGroupSession) error {
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

			log.Printf("Message claimed: itemId = %s, timestamp = %v, topic = %s", item.Id, message.Timestamp, message.Topic)
			session.MarkMessage(message, "")

		case <-session.Context().Done():
			return nil
		}
	}
}
