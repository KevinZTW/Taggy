.PHONY : run build check test clean stop deps

MONGO_VERSION=4.4
BIN_FILE=server
MY_VOLUME=~/data/rssservice/db

ALL_PATH=./...

DOCKER_CMD=docker
GO_CMD=go
GO_BUILD=$(GO_CMD) build
GO_CLEAN=$(GO_CMD) clean
GO_TEST=$(GO_CMD) test
GO_GET=$(GO_CMD) get
GO_VET=$(GO_CMD) vet
GO_RUN=$(GO_CMD) run



all: test clean build run

deps:
	$(GO_GET) -u ./...

build:
	$(GO_BUILD) -o ./$(BIN_FILE)

dev: stop
	mkdir -p $(MY_VOLUME)
	$(DOCKER_CMD) run --name mongo-$(MONGO_VERSION) -v $(MY_VOLUME):/data/db -d -p 27018:27017 --rm mongo:$(MONGO_VERSION)
	./$(BIN_FILE)

stop:
	@if $(DOCKER_CMD) ps --filter name=mongo-$(MONGO_VERSION) | grep -q "mongo-$(MONGO_VERSION)"; then \
		$(DOCKER_CMD) stop mongo-$(MONGO_VERSION); \
	fi

test:
	$(GO_CMD) test -v $(ALL_PATH) -cover

clean: stop
	$(GO_CMD) clean
	rm -f $(BIN_FILE)
	@if $(DOCKER_CMD) ps -a --filter name=mongo-$(MONGO_VERSION) --format '{{.Names}}' | grep -q "mongo-$(MONGO_VERSION)"; then \
		$(DOCKER_CMD) rm mongo-$(MONGO_VERSION); \
	fi