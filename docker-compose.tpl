linkpin:
  build: .
  hostname: linkpin-{{NODE_ENV}}
  command: npm start
  environment:
    - NODE_ENV={{NODE_ENV}}
    - NODE_ENV_MONGO_PORT={{NODE_ENV_MONGO_PORT}}
    - NODE_ENV_MONGO_HOST={{NODE_ENV_MONGO_HOST}}
    - NODE_ENV_MONGO_DATABASE={{NODE_ENV_MONGO_DATABASE}}
    - NODE_ENV_REDIS_HOST={{NODE_ENV_REDIS_HOST}}
    - NODE_ENV_REDIS_PORT={{NODE_ENV_REDIS_PORT}}
  restart: always
  log_opt:
    max-size: "500m"
    max-file: "2"
  ports:
    - "{{DOCKER_ENV_PORTS}}"
  links:
    - mongo
{% if NODE_ENV === 'production'  -%}
    - redis
  redis:
    image: redis
    ports:
      - "6379:6379"
    volumes:
      - /usr/opt/backup/redisbackup:/data:Z
{% endif -%}
mongo:
  image: mongo
  ports:
    - "27017:27017"
mongobackup:
  image: goliatone/docker-mongo-backup
  links:
    - mongo
  volumes:
    - {{DOCKER_ENV_VOLUME_MONGOBACKUP}}/mongobackup:/mongobackup
  environment:
    - MONGO_PORT={{NODE_ENV_MONGO_PORT}}
    - MONGO_HOST={{NODE_ENV_MONGO_HOST}}
    - CRON_SCHEDULE={{MONGOBACKUP_BACKUP_CRON}}
