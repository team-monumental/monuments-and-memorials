# VM Setup

### Setup SSH Keys

#### Step 1: Initial Connection

When you create an EC2, amazon will make you download a `.pem` file, for example `monuments.pem`. Use this for your initial connection to the VM.

```bash
chmod 400 monuments.pem
ssh -i "monuments.pem" ubuntu@<server address>
```

#### Step 2: Setting up your keys

Follow [these instructions](https://gist.github.com/stormpython/9517102) to setup your own SSH keys and add them to the VM. You will need to specify your `monuments.pem` when using ssh commands. Skip the part at the end about deleting root password. You may want to skip adding a password to the key if you don't want to enter it every time you connect.

Once you've setup your keys and added them to the VM, try connecting to it without using `monuments.pem`.

### Install Dependencies

#### Step 1: Update Packages

```bash
sudo apt-get update
sudo apt-get upgrade
```

#### Step 2: Install PostgreSQL 12

At this time `postgresql-12` is not available in `apt` by default, so you must add the GPG key and the repository

```bash
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
```

```bash
sudo apt update
sudo apt install postgresql-12 postgresql-client-12
```

##### Setup PostgreSQL

```bash
sudo su - postgres
psql -c "alter user postgres with password 'password'"
exit
sudo nano /etc/postgresql/12/main/pg_hba.conf
```

In this file, find the line `local all postgres peer` and change `peer` to `md5` and save.

Now try to connect to Postgres using the password `password`

```bash
sudo systemctl restart postgresql
psql postgres postgres
```

Close the Postgres connection

```sql
\q
```

##### Install Postgis and PG_TRGM

```bash
sudo apt install postgis postgresql-12-postgis-3
psql postgres postgres
```

```sql
CREATE EXTENSION postgis;
CREATE EXTENSION pg_trgm;
\q
```

#### Step 3: Install OpenJDK 13

```bash
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-13-jdk
```

#### Step 4: Install AWS CLI

Follow the instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html) on installing the AWS CLI. Once it is installed, setup the credentials for the AWS account being used by creating the file `~/.aws/credentials`

```
[default]
aws_access_key_id = <Access Key Id>
aws_secret_access_key = <Secret Access Key>
```

### Setup the Java Server

Start by cloning the repository

```bash
git clone https://github.com/team-monumental/monuments-and-memorials.git
```

Add this line to the sudoers file so that git can run the build script without sudo. Note that this may not be necessary if using the default `ubuntu` user on EC2 as it doesn't require password authentication for sudo uses anyway

```bash
sudo visudo
Under the $admin ALL=(ALL) ALL line add:
%ubuntu ALL=NOPASSWD: /bin/systemctl start monumental, /bin/systemctl stop monumental, /usr/bin/java
```

Setup the githook to make the repository build the project when changes are pushed to it

```bash
cd monuments-and-memorials
cp docs/post-receive .git/hooks
chmod u+rwx .git/hooks/post-receive
chmod u+rwx run.sh
```

Run the build so that the server is ready to be run

```bash
cd .git
./hooks/post-receive
```

Create and enable the service so that the server is always running automatically

```bash
sudo cp docs/monumental.service /etc/systemd/system/monumental.service
sudo systemctl enable monumental.service
```

Add rules to the firewall to forward port 443 to port 8443

```bash
sudo iptables -A INPUT -i eth0 -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -i eth0 -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -i eth0 -p tcp --dport 8443 -j ACCEPT
sudo iptables -A PREROUTING -t nat -p tcp --dport 443 -j REDIRECT --to-ports 8443
```

Then install `iptables-persistent`, when it asks if you'd like to save the current firewall settings say yes

```bash
sudo apt-get install iptables-persistent
```

At this time you should go to the EC2 console, find the security group being used for the instance, and update its inbound port rules, opening ports 80 and 443. **Be sure to keep port 22 open**

![](https://i.imgur.com/8QkinUy.png)

### Finish

At this point, you can restart the service once more

```bash
sudo systemctl restart monumental
```

And check if the frontend is visible on port 443. If it's not, try port 8443. If it's visible on 8443 and not 443 then there is a firewall issue. If it's visible on neither, you will need to check if the server is running. You can use `journalctl` to view the services logs. For example, viewing the 100 most recent lines:

```bash
sudo journalctl -u monumental.service -n 100
```

