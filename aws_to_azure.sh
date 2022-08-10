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
system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

str_typ=$(cat /home/$system_user_name/cqube_config | grep CQUBE_STORAGE_TYPE )
src_type=$(cut -d "=" -f2 <<< "$str_typ")

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)


if [[ $src_type = "s3" ]]; then
output_bucket=$(awk ''/^s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
input_bucket=$(awk ''/^s3_input_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
emission_bucket=$(awk ''/^s3_emission_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
fi
azure_input_container=$(awk ''/^azure_input_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_output_container=$(awk ''/^azure_output_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_emission_container=$(awk ''/^azure_emission_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_name=$(awk ''/^azure_account_name:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_key==$(awk ''/^azure_account_key:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

export AWS_ACCESS_KEY_ID=$aws_access_key
export AWS_SECRET_ACCESS_KEY=$aws_secret_key

if [[ $src_type = "s3" ]] && [[ $storage_type = "azure" ]]; then
irbucket=$(aws s3 sync s3://$output_bucket /home/$system_user_name/azure_output)
fi
if [[ $src_type = "s3" ]] && [[ $storage_type = "azure" ]]; then
irbucket=$(aws s3 sync s3://$input_bucket /home/$system_user_name/azure_input)
fi
if [[ $src_type = "s3" ]] && [[ $storage_type = "azure" ]]; then
irbucket=$(aws s3 sync s3://$emission_bucket /home/$system_user_name/azure_emission)
fi

if [[ $src_type = "s3" ]] && [[ $storage_type = "azure" ]]; then
sudo az storage blob upload-batch --connection-string "DefaultEndpointsProtocol=https;AccountName=$azure_account_name;AccountKey=$azure_account_key;EndpointSuffix=core.windows.net" --destination $azure_input_container --source /home/$system_user_name/azure_input > /dev/null 2>&1
fi

if [[ $src_type = "s3" ]] && [[ $storage_type = "azure" ]]; then
sudo az storage blob upload-batch --connection-string "DefaultEndpointsProtocol=https;AccountName=$azure_account_name;AccountKey=$azure_account_key;EndpointSuffix=core.windows.net" --destination $azure_output_container --source /home/$system_user_name/azure_output > /dev/null 2>&1
fi


if [[ $src_type = "s3" ]] && [[ $storage_type = "azure" ]]; then
sudo az storage blob upload-batch --connection-string "DefaultEndpointsProtocol=https;AccountName=$azure_account_name;AccountKey=$azure_account_key;EndpointSuffix=core.windows.net" --destination $azure_emission_container --source /home/$system_user_name/azure_emission > /dev/null 2>&1
fi
