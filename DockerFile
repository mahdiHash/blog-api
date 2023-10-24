FROM debian:12.0

RUN apt install -yq nodejs \
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.7"

RUN bun install

CMD ["bun", "run", "start:dev"]

EXPOSE 3000

COPY . /blog-api

WORKDIR /blog-api