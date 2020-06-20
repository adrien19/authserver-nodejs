# FROM debian:latest

# RUN apt-get update && apt-get install -qq -y \
#     shellcheck \
#   && rm -rf /var/lib/apt/lists/*

# WORKDIR /usr/src/app/

# COPY . /usr/src/app/

FROM postgres:9.6.3
ENV POSTGRES_USER adrien
ENV POSTGRES_PASSWORD adrien
ENV POSTGRES_DB auth_database_prod
EXPOSE 5432