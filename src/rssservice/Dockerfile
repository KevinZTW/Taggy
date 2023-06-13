FROM golang:1.20-alpine AS builder
RUN apk add build-base protobuf-dev protoc
WORKDIR /usr/src/app/

COPY ./src/rssservice/ ./
COPY ./pb/ ./proto/
RUN go mod download
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2


# Build executable
RUN protoc -I ./proto/ ./proto/taggy.proto --go_out=./ --go-grpc_out=./
RUN go build -o /go/bin/rssservice/ ./


FROM alpine

WORKDIR /usr/src/app/

COPY --from=builder /go/bin/rssservice/ ./

EXPOSE ${RSS_SERVICE_PORT}
ENTRYPOINT [ "./rssservice" ]