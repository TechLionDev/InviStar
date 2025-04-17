FROM alpine:latest

ARG PB_VERSION=0.25.8

WORKDIR /pb

COPY pb_migrations pb_migrations

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

RUN /pb/pocketbase superuser upsert admin pass

RUN /pb/pocketbase migrate

COPY pb_data_prod pb_data

RUN /pb/pocketbase migrate

EXPOSE 8090

# start PocketBase with data directory that can be mounted
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations"]
