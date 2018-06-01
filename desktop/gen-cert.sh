#!/bin/bash

rm -rf certs
mkdir certs

openssl req \
  -x509 \
  -sha256 \
  -nodes \
  -newkey rsa:2048 \
  -days 365 \
  -keyout certs/server.key \
  -out certs/server.crt \
  -subj "/C=US/ST=New York/L=New York/O=ACME Inc/CN=*.crbapps.dev" \
  -reqexts SAN \
  -extensions SAN \
  -config <(cat /System/Library/OpenSSL/openssl.cnf \
    <(printf '[SAN]\nsubjectAltName=DNS:*.crbapps.dev'))
