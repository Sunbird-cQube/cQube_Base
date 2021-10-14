#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

aws s3api help > /dev/null 2>&1
if [ ! $? == 0 ]; then

echo "Installing aws cli ..."
wget https://s3.amazonaws.com/aws-cli/awscli-bundle.zip  > /dev/null 2>&1
echo "A" | unzip awscli-bundle.zip  > /dev/null 2>&1 
echo "Configuring aws cli ..."
python3 ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws  > /dev/null 2>&1
python3 ./awscli-bundle/install -b ~/bin/aws  > /dev/null 2>&1
python3 ./awscli-bundle/install -h  > /dev/null 2>&1
fi
