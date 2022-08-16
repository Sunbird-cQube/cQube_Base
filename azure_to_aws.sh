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

sudo apt install awscli -y

output_bucket=$(awk ''/^s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)

input_bucket=$(awk ''/^s3_input_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)

emission_bucket=$(awk ''/^s3_emission_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)

aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)

export AWS_ACCESS_KEY_ID=$aws_access_key
export AWS_SECRET_ACCESS_KEY=$aws_secret_key

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

azure_input_container=$(awk ''/^azure_input_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_output_container=$(awk ''/^azure_output_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_emission_container=$(awk ''/^azure_emission_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_name=$(awk ''/^azure_account_name:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_key=$(awk ''/^azure_account_key:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)
storage_account_sas_token=$(awk ''/^storage_account_sas_token:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

wget https://aka.ms/downloadazcopy-v10-linux
tar -xvf downloadazcopy-v10-linux
sudo rm /usr/bin/azcopy
sudo cp ./azcopy_linux_amd64_*/azcopy /usr/bin/


str_typ=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_STORAGE_TYPE )
src_type=$(cut -d "=" -f2 <<< "$str_typ")


if [[ $src_type = "azure" ]] && [[ $storage_type = "s3" ]]; then
sudo azcopy copy https://$azure_account_name.blob.core.windows.net/$azure_input_container/*$storage_account_sas_token /tmp/cqube_migration/azure_input --recursive
fi

if [[ $src_type = "azure" ]] && [[ $storage_type = "s3" ]]; then
sudo azcopy copy https://$azure_account_name.blob.core.windows.net/$azure_output_container/*$storage_account_sas_token /tmp/cqube_migration/azure_output --recursive
fi

if [[ $src_type = "azure" ]] && [[ $storage_type = "s3" ]]; then
sudo azcopy copy https://$azure_account_name.blob.core.windows.net/$azure_emission_container/*$storage_account_sas_token /tmp/cqube_migration/azure_emission --recursive
fi


if [[ $src_type = "azure" ]] && [[ $storage_type = "s3" ]]; then
irbucket=$(aws s3 sync /tmp/cqube_migration/azure_output s3://$output_bucket)
fi
if [[ $src_type = "azure" ]] && [[ $storage_type = "s3" ]]; then
irbucket=$(aws s3 sync /tmp/cqube_migration/azure_input s3://$input_bucket)
fi
if [[ $src_type = "azure" ]] && [[ $storage_type = "s3" ]]; then
irbucket=$(aws s3 sync /tmp/cqube_migration/azure_emission s3://$emission_bucket)
fi
