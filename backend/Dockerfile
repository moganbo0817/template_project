# デプロイ用コンテナに含めるバイナリを作成するコンテナ
FROM golang:1.19.4-bullseye as deploy-builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build  -o app

# ---------------------------------------------------

FROM debian:bullseye-slim as deploy

RUN apt-get update

COPY --from=deploy-builder /app/app .

CMD ["./app"]

# ---------------------------------------------------

FROM golang:1.19.4 as dev
RUN go install github.com/cosmtrek/air@v1.29.0
WORKDIR /app

CMD ["air", "-c", ".air.toml"]
