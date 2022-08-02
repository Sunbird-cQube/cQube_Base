#!/bin/bash

azure_input_container=$(awk ''/^azure_input_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_output_container=$(awk ''/^azure_output_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_emission_container=$(awk ''/^azure_emission_container:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_name=$(awk ''/^azure_account_name:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

azure_account_key==$(awk ''/^azure_account_key:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

dir=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_OUTPUT_DIRECTORY )
source_output_directory=$(cut -d "=" -f2 <<< "$dir")

dir=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_INPUT_DIRECTORY )
source_input_directory=$(cut -d "=" -f2 <<< "$dir")

dir=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_EMISSION_DIRECTORY )
source_emission_directory=$(cut -d "=" -f2 <<< "$dir")

system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

#az login > /dev/null 2>&1


if [[ $src_type = "local" ]] && [[ $storage_type = "azure" ]]; then
az storage blob upload-batch --connection-string "DefaultEndpointsProtocol=https;AccountName=$azure_account_name;AccountKey=$azure_account_key;EndpointSuffix=core.windows.net" --destination $azure_input_container --source $source_input_directory > /dev/null 2>&1
fi

if [[ $src_type = "local" ]] && [[ $storage_type = "azure" ]]; then
az storage blob upload-batch --connection-string "DefaultEndpointsProtocol=https;AccountName=$azure_account_name;AccountKey=$azure_account_key;EndpointSuffix=core.windows.net" --destination $azure_output_container --source $source_output_directory > /dev/null 2>&1
fi


if [[ $src_type = "local" ]] && [[ $storage_type = "azure" ]]; then
az storage blob upload-batch --connection-string "DefaultEndpointsProtocol=https;AccountName=$azure_account_name;AccountKey=$azure_account_key;EndpointSuffix=core.windows.net" --destination $azure_output_container --source $source_emission_directory > /dev/null 2>&1
fi
