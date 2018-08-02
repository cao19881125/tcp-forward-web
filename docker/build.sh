#!/bin/bash

tar czf ./tcp-forward-web.tar.gz ../tcp-forward-web
docker build -t cao19881125/tcp-forward-web:latest .
rm -rf ./tcp-forward-web.tar.gz
