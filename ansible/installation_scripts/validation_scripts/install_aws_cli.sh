#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

wget https://s3.amazonaws.com/aws-cli/awscli-bundle.zip  > /dev/null 2>&1
echo "A" | unzip awscli-bundle.zip  > /dev/null 2>&1 
./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws  > /dev/null 2>&1
./awscli-bundle/install -b ~/bin/aws  > /dev/null 2>&1
./awscli-bundle/install -h  > /dev/null 2>&1

AWS_DIR=$HOME/.aws
SYS_USERNAME=`grep 'system_user_name:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
ACCESS_KEY=`grep 's3_access_key:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
SECRET_KEY=`grep 's3_secret_key:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`
DEFAULT_REGION=`grep 'aws_default_region:' $VAL_DIR/../vars/main.yml | awk '{print $2}'`

if [ ! -d $AWS_DIR ]
then
    mkdir $AWS_DIR
    echo """[default]
aws_access_key_id = $ACCESS_KEY
aws_secret_access_key = $SECRET_KEY""" >> $AWS_DIR/credentials
    echo """[default]
region = $DEFAULT_REGION""" >> $AWS_DIR/config
    chown $SYS_USERNAME:$SYS_USERNAME -R $AWS_DIR/
    chmod 600 $AWS_DIR/config $AWS_DIR/credentials
#else
#    echo "Aws already configured in your system. Kindly remove the .aws directory from your home directory"
fi
