FROM node:6.2
MAINTAINER goliatone <hello@goliatone.com>

ENV TARGET_DIR /opt/linkpin

RUN mkdir $TARGET_DIR
WORKDIR $TARGET_DIR

ENV DEBIAN_FRONTEND noninteractive

RUN npm i -g pm2

COPY src/package.json /tmp/package.json

#Timeout ssh-keyscan to 60 seconds
RUN \
    mkdir -p $TARGETDIR && \
    mkdir $TARGETDIR/logs && \
    chmod 775 $TARGETDIR/logs && \
    cd /tmp && npm install --quiet && \
    cp -a /tmp/node_modules $TARGETDIR

ENV DEBUG linkpin

COPY src $TARGETDIR

EXPOSE 1337

CMD ["npm", "start"]
