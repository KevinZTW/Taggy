package kafka

import (
	"context"

	"github.com/Shopify/sarama"
	"go.opentelemetry.io/contrib/instrumentation/github.com/Shopify/sarama/otelsarama"
)

var (
	GroupID = "recommendationservice_new_rss_item_consumer_group"
)

func StartNewRSSItemConsumerGroup(ctx context.Context, brokers []string, handler sarama.ConsumerGroupHandler) error {
	saramaConfig := sarama.NewConfig()

	saramaConfig.Version = ProtocolVersion

	saramaConfig.Producer.Return.Successes = true

	// testing
	saramaConfig.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin

	client, err := sarama.NewClient(brokers, saramaConfig)
	if err != nil {
		return err
	}

	consumerGroup, err := sarama.NewConsumerGroupFromClient(GroupID, client)

	// testing

	//consumerGroup, err := sarama.NewConsumerGroup(brokers, GroupID, saramaConfig)
	if err != nil {
		return err
	}

	wrappedHandler := otelsarama.WrapConsumerGroupHandler(handler)

	err = consumerGroup.Consume(ctx, []string{NewRSSItemTopic}, wrappedHandler)
	if err != nil {
		return err
	}
	return nil
}
