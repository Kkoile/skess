#!/bin/bash
set -e

NAME="telestrations_redis";
PW="mysecretpassword";

echo "echo stop & remove old docker [$NAME] and starting new fresh instance of [$NAME]"
(docker kill $NAME || :) && \
  (docker rm $NAME || :) && \
  docker run --name $NAME \
  -p 6379:6379 \
  -d redis

# wait for redis to start
echo "sleep wait for redis-server [$NAME] to start";
SLEEP 3;
