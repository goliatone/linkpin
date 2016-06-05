services:
  linkpin:
    build: .
      hostname: linkpin-{{NODE_ENV}}
      command: npm start
      environment:
        - NODE_ENV_MONGO_HOST={{NODE_ENV_MONGO_HOST}}
        - NODE_ENV_MONGO_PORT={{NODE_ENV_MONGO_PORT}}
        - NODE_ENV_MONGO_DATABASE={{NODE_ENV_MONGO_DATABASE}}
      restart: always
      links:
        - mongo
      log_opt:
          max-size: "500m"
          max-file: "2"
      ports:
        {% if NODE_ENV === 'development' -%}
          - "1337:1337"
        {% else -%}
          - "80:1337"
        {% endif -%}
  mongo:
    image: mongo
    ports:
      - "27017:27017"
