#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

echo "Installing aws cli ..."
wget https://s3.amazonaws.com/aws-cli/awscli-bundle.zip  > /dev/null 2>&1
echo "A" | unzip awscli-bundle.zip  > /dev/null 2>&1 
echo "Configuring aws cli ..."
./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws  > /dev/null 2>&1
./awscli-bundle/install -b ~/bin/aws  > /dev/null 2>&1
./awscli-bundle/install -h  > /dev/null 2>&1

