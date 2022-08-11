#!/bin/bash

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

azure_input_container=$(awk ''/^azure_input_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_output_container=$(awk ''/^azure_output_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_emission_container=$(awk ''/^azure_emission_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_name=$(awk ''/^azure_account_name:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_key==$(awk ''/^azure_account_key:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azr=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_AZURE_OUTPUT_STORAGE )
source_output_container=$(cut -d "=" -f2 <<< "$azr")

echo "$source_output_container"
azr=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_AZURE_INPUT_STORAGE )
source_input_container=$(cut -d "=" -f2 <<< "$azr")

echo "$source_input_container"
azr=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_AZURE_EMISSION_STORAGE )
source_emission_container=$(cut -d "=" -f2 <<< "$azr")

str_typ=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_STORAGE_TYPE )
src_type=$(cut -d "=" -f2 <<< "$str_typ")

az login > /dev/null 2>&1

if [[ $src_type = "azure" ]] && [[ $storage_type = "azure" ]]; then
sudo az storage blob copy start-batch --account-key $azure_account_key --account-name $azure_account_name --destination-container $azure_output_container --source-account-key $azure_account_key --source-account-name $azure_account_name --source-container $source_output_container
fi

if [[ $src_type = "azure" ]] && [[ $storage_type = "azure" ]]; then
sudo az storage blob copy start-batch --account-key $azure_account_key --account-name $azure_account_name --destination-container $azure_input_container --source-account-key $azure_account_key --source-account-name $azure_account_name --source-container $source_input_container
fi

if [[ $src_type = "azure" ]] && [[ $storage_type = "azure" ]]; then
sudo az storage blob copy start-batch --account-key $azure_account_key --account-name $azure_account_name --destination-container $azure_emission_container --source-account-key $azure_account_key --source-account-name $azure_account_name --source-container $source_emission_container
fi