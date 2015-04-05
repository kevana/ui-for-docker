FROM gliderlabs/alpine:3.1

COPY dockerui /
COPY dist /

EXPOSE 9000
ENTRYPOINT ["/dockerui"]
