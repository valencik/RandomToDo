#First things first...
apt-get update
apt-get --assume-yes upgrade

#Install basic tools
apt-get --assume-yes --quiet install git vim

# Get Couchbase
curl -sSfLO http://packages.couchbase.com/releases/3.0.1/couchbase-server-community_3.0.1-ubuntu12.04_amd64.deb
sudo dpkg -i couchbase-server-community_3.0.1-ubuntu12.04_amd64.deb
