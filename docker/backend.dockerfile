FROM node

WORKDIR /backend

COPY scripts/backend/entrypoint.sh /

RUN apt-get -y update

# debugging
RUN apt-get -y install curl vim 

CMD ["/entrypoint.sh"]
