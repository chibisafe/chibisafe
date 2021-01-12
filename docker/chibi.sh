#!/bin/bash
docker-compose -f docker-compose.yml -f docker-compose.$1.yml -f docker-compose.config.yml ${@%$1}
