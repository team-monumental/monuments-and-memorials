# SSL/HTTPS Setup

### About

SSL/HTTPS is pretty much mandatory these days in the eyes of most browsers. Thankfully, [Let's Encrypt](https://letsencrypt.org/) is a 100% free certificate authority so it's just a matter of time spent setting the certificate up.

### Step 1: Setup Certbot

```bash
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

### Step 2: Obtain Certificate

At this point it's important to make sure that the HTTP (80) and HTTPS (443) ports are open in the EC2 security group

![](https://i.imgur.com/QVHiuqe.png)

In order to verify the domain name, we need to disable the port forwarding from 80 to 8080, as this will interfere with certbot. Assuming iptables-persistent is setup correctly, you can just reboot the VM after to restore the configuration.

```bash
sudo iptables -F -t nat
```

Then we can run a certbot dry run to make sure everything is working (dry runs have a higher request limit, so if something is wrong you won't hit the request limit on their production server)

```bash
sudo certbot certonly --standalone -d monuments.us.org -d www.monuments.us.org --dry-run
```

If all goes well, run the same command without `--dry-run`

### Step 3: Configure With Spring Boot

We need to convert the created `.pem` certificake into the `pkcs12` format that Spring expects. Leave the password blank.

```bash
sudo openssl pkcs12 -export -in /etc/letsencrypt/live/monuments.us.org/fullchain.pem -inkey /etc/letsencrypt/live/monuments.us.org/privkey.pem -out /etc/letsencrypt/live/monuments.us.org/keystore.p12 -name tomcat -CAfile /etc/letsencrypt/live/monuments.us.org/chain.pem -caname root
```

If you didn't set up redirect from port 443 to 8443 in the initial VM setup, do so now

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to 8443
sudo dpkg-reconfigure iptables-persistent
```

Now, if you run this command you should see redirects from 443 to 8443

```bash
sudo iptables -L -n -t nat
```

At this point you can restart the java server and verify that you can now connect with an https connection (https://monuments.us.org/)

```bash
sudo systemctl restart monumental
```

### Step 4: Automating Renewal

Since this project does not have long term technical support, it's critical that the certificate renew completely automatically.

I have created a bash script, `ssl-renew.sh` in the root of the repository that should be run after certbot's automatic renewal. You may need to modify it slightly if file/path names are different or other changes to the process were made.

Once you are satisfied with the script, you can test it by changing `sudo certbot renew` to `sudo certbot renew --dry-run`. Then run the script `./ssl-renew` and check that the server's SSL still works when it starts up. Note that this is still using your existing certificate, not a new one, but should be a valid test.

FInally, create the cron job that will run the script every other month. The certificates expire every three months but this avoids any weird cron timing causing the site to have an expired cert for any period of time, and also gives time to handle renewal failures if they occur. First, open crontab

```bash
crontab -e
```

Then, at the bottom of the file add the new job

```bash
0 0 1 */2 * /home/ubuntu/monuments-and-memorials/renew-ssl.sh &>>/tmp/renew-ssl.log
```

This will set the job to run at the start of every other month and print the output to `renew-ssl.log`.