FROM node

WORKDIR /frontend/app

COPY scripts/frontend/entrypoint.sh /

RUN apt-get -y update

# debugging
RUN apt-get -y install curl vim

RUN npm install -g serve

RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
