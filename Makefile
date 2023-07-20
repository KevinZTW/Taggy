.PHONY: start
start:
	docker compose up --no-attach=grafana --no-attach=kafka --no-attach=prometheus --no-attach=envoy --no-attach=zipkin --no-attach=kafka-ui --no-attach=otel-col
.PHONY: up
up: build
	docker compose up --no-attach=grafana --no-attach=kafka

	
.PHONY: generate-protobuf
generate-protobuf:
	./gen-proto.sh

.PHONY: build
build:
	docker compose --env-file .env -f docker-compose.yml build