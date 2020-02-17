#!/bin/bash

sudo certbot renew --dry-run
sudo openssl pkcs12 -export -in /etc/letsencrypt/live/monuments.us.org/fullchain.pem -inkey /etc/letsencrypt/live/monuments.us.org/privkey.pem -out /etc/letsencrypt/live/monuments.us.org/keystore.p12 -name tomcat -CAfile /etc/letsencrypt/live/monuments.us.org/chain.pem -caname root
cd /home/ubuntu/monuments-and-memorials
sudo cp /etc/letsencrypt/live/monuments.us.org/keystore.p12 ./
./gradlew build -s -x test
sudo systemctl restart monumental
