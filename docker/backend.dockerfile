FROM node:latest

WORKDIR /backend

COPY scripts/backend/entrypoint.sh /

RUN apt-get -y update

RUN npm install -g npm@latest
RUN npm install -g npm-check-updates
RUN npm install -g @nestjs/cli
RUN npm update

# debugging
RUN apt-get -y install curl vim 

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
