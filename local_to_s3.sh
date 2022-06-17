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

remote_storage_type=$(awk ''/^remote_storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)

output_bucket=$(awk ''/^s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)

aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)


dir=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_OUTPUT_DIRECTORY )
source_output_directory=$(cut -d "=" -f2 <<< "$dir")

sudo apt install awscli -y

export AWS_ACCESS_KEY_ID=$aws_access_key
export AWS_SECRET_ACCESS_KEY=$aws_secret_key


if [[ $storage_type = "local" ]] && [[ $remote_storage_type = "s3" ]]; then
irbucket=$(aws s3 sync $source_output_directory s3://$output_bucket)
fi

