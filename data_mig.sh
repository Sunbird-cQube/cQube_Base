#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

aws s3api help > /dev/null 2>&1
if [ ! $? == 0 ]; then

echo "Installing aws cli ..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  > /dev/null 2>&1
sudo apt install unzip
echo "A" | unzip awscliv2.zip  > /dev/null 2>&1
echo "Configuring aws cli ..."
./aws/install  > /dev/null 2>&1
./aws/install -i /usr/local/aws-cli -b /usr/local/bin > /dev/null 2>&1
fi

storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

str_typ=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_STORAGE_TYPE )
src_type=$(cut -d "=" -f2 <<< "$str_typ")

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

if [[ $storage_type = "local" ]]; then
output_directory=$(awk ''/^output_directory:' /{ if ($2 !~ /#.*/) {print $2}}' local_storage_config.yml)
fi

if [[ $storage_type = "s3" ]]; then
output_bucket=$(awk ''/^s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
fi

bucket=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_S3_OUTPUT )
source_bucket=$(cut -d "=" -f2 <<< "$bucket")



export AWS_ACCESS_KEY_ID=$aws_access_key
export AWS_SECRET_ACCESS_KEY=$aws_secret_key

if [[ $src_type = "s3" ]] && [[ $storage_type = "s3" ]]; then
irbucket=$(aws s3 sync s3://$source_bucket s3://$output_bucket)
fi

if [[ $src_type = "s3" ]] && [[ $storage_type = "local" ]]; then

irbucket=$(aws s3 sync s3://$source_bucket $output_directory)
fi

