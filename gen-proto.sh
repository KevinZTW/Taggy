#!/bin/sh

base_dir=$(pwd)

gen_proto_go() {
  echo "Generating Go protobuf files for $1"
  cd "$base_dir"/src/"$1" || return
  protoc -I ../../pb ./../../pb/taggy.proto --go_out=./ --go-grpc_out=./
  cd "$base_dir" || return
}

gen_proto_js() {
  echo "Generating Javascript protobuf files for $1"
  cd "$base_dir"/src/"$1" || return
  cp "$base_dir"/pb/taggy.proto .
  cd "$base_dir" || return
}

gen_proto_python() {
  echo "Generating Python protobuf files for $1"
  cd "$base_dir"/src/"$1" || return
  python3 -m grpc_tools.protoc -I=../../pb --python_out=./ --grpc_python_out=./ ./../../pb/taggy.proto
  cd "$base_dir" || return
}

gen_proto_go fetchservice