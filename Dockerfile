FROM alpine
EXPOSE 3000

RUN apk upgrade && apk update \
&& apk add npm \
&& npm install -g @nestjs/cli

COPY scripts/run.sh .
RUN chmod +x run.sh
CMD ["sh", "run.sh"]
