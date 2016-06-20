linkpin:
  build: .
  hostname: linkpin-{{NODE_ENV}}
  command: npm start
  environment:
    - NODE_ENV={{NODE_ENV}}
    - NODE_ENV_MONGO_PORT={{NODE_ENV_MONGO_PORT}}
    - NODE_ENV_MONGO_HOST={{NODE_ENV_MONGO_HOST}}
    - NODE_ENV_MONGO_DATABASE={{NODE_ENV_MONGO_DATABASE}}
  restart: always
  links:
    - mongo
  log_opt:
    max-size: "500m"
    max-file: "2"
  ports:
    - "{{DOCKER_ENV_PORTS}}"
mongo:
  image: mongo
  ports:
    - "27017:27017"
mongobackup:
  image: goliatone/docker-mongo-backup
  volumes:
    - {{DOCKER_ENV_VOLUME_MONGOBACKUP}}/mongobackup:/mongobackup
  environment:
    - MONGO_PORT={{NODE_ENV_MONGO_PORT}}
    - MONGO_HOST={{NODE_ENV_MONGO_HOST}}
    - CRON_SCHEDULE={{MONGOBACKUP_BACKUP_CRON}}
