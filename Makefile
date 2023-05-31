.PHONY: generate-protobuf
generate-protobuf:
	./gen-proto.sh

.PHONY: build
build:
	docker compose --env-file .env -f docker-compose.yml build