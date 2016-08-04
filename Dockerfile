FROM gliderlabs/alpine:3.1

COPY dist /

VOLUME /data

EXPOSE 9000
ENTRYPOINT ["/ui-for-docker"]
