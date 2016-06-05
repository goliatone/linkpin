FROM node:5.11.1
MAINTAINER goliatone <hello@goliatone.com>

ENV TARGETDIR /opt/linkpin

WORKDIR $TARGETDIR

ENV DEBIAN_FRONTEND noninteractive

RUN npm i -g pm2

COPY src/package.json /tmp/package.json

#Timeout ssh-keyscan to 60 seconds
RUN \
    mkdir -p $TARGETDIR/logs && \
    chmod 775 $TARGETDIR/logs && \
    cd /tmp && npm install --quiet && \
    cp -a /tmp/node_modules $TARGETDIR

ENV DEBUG linkpin

COPY src $TARGETDIR

EXPOSE 3030

CMD ["npm", "start"]
