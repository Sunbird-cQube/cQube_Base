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

echo "Validating aws cli ..."

AWS_DIR=$HOME/.aws
SYS_USERNAME=`grep 'system_user_name:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
ACCESS_KEY=`grep 's3_access_key:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
SECRET_KEY=`grep 's3_secret_key:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
DEFAULT_REGION=`grep 'aws_default_region:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`

config_aws(){

mkdir $AWS_DIR
echo """[default]
aws_access_key_id = $ACCESS_KEY
aws_secret_access_key = $SECRET_KEY""" >> $AWS_DIR/credentials
chown $SYS_USERNAME:$SYS_USERNAME -R $AWS_DIR/
chmod 600 $AWS_DIR/credentials

}

if [ ! -d $AWS_DIR ]; then
    config_aws
else
    rm -rf $AWS_DIR
    config_aws
fi
