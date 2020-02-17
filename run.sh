#!/bin/bash

java -jar build/libs/monuments-and-memorials-0.0.1-SNAPSHOT.jar --server.port=8443 --security.require-ssl=true --server.ssl.key-store=${SSL_KEY_STORE} --server.ssl.key-store-password=${SSL_PASSWORD} --server.ssl.keyStoreType=PKCS12 --server.ssl.keyAlias=tomcat