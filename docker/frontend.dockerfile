FROM node:latest

WORKDIR /frontend

COPY scripts/frontend/entrypoint.sh /

RUN apt-get -y update

RUN npm install -g npm@latest
RUN npm install -g npm-check-updates
RUN npm update

# debugging
RUN apt-get -y install curl vim

RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
