#!/bin/bash

check_az_container_naming()
{
az_container_naming_status=0
if [[ $1 =~ ^[a-z0-9-]*[^-]$ ]]; then
    if [[  $1 =~ \-{2,} ]]; then
        az_container_naming_status=1
        return $az_container_naming_status;
    fi
else
    az_container_naming_status=1
    return $az_container_naming_status;
fi
}

check_az_key(){
    az_key_status=0
    export AZURE_STORAGE_CONNECTION_STRING="$1"

    az storage container list --account-name $azure_account_name --account-key $azure_account_key > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then echo "Error - Invalid az account key"; fail=1
        az_key_status=1
    fi
}

check_az_storage_account_name(){
    az_account_status=0
    export AZURE_STORAGE_CONNECTION_STRING="$1"

    az storage container list --account-key $azure_account_key --account-name $azure_account_name > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then echo "Error - Invalid az account name"; fail=1
        az_account_status=1
    fi
}


check_az_container(){
if [[ $az_key_status == 0 ]]; then
        containerstatus=`az storage container exist --account-name $azure_account_name --account-key $azure_account_key --name $container_name "${2}" 2>&1`
        if [ ! $? == 0 ]
        then
            echo "Error - [ $1 : $2 ] Container not owned or not found. Please change the container name in azure_container_config.yml"; fail=1
        fi
fi
}

get_az_container_config_values(){
key=$1
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)
}

bold=$(tput bold)
normal=$(tput sgr0)
fail=0
if [[ ! $# -eq 0 ]]; then
   core_install=$1
else
   core_install="NA"
fi

echo -e "\e[0;33m${bold}Validating the aws_s3_config file...${normal}"


# An array of mandatory values
declare -a arr=("azure_account_name" "azure_account_key" "azure_input_container" "azure_output_container" "azure_emission_container")

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Getting aws keys
account_name=$(awk ''/^azure_account_name:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)
account_key=$(awk ''/^azure_account_key:' /{ if ($2 !~ /#.*/) {print $2}}' azure_container_config.yml)

# Iterate the array and retrieve values for mandatory fields from config file
for i in ${arr[@]}
do
get_azure_container_config_values $i
done

for i in ${arr[@]}
do
key=$i
value=${vals[$key]}
case $key in

   azure_account_name)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
	   else
		   check_az_storage_account_name $key $value 	  
       fi
       ;;
   azure_account_key)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
      else
          check_az_key $key $value
       fi
       ;;
   az_input_container)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_az_container $key $value
       fi
       ;;
   az_output_container)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_az_container $key $value
       fi
       ;;
   az_emission_container)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_az_container $key $value
       fi
       ;;
   *)
       if [[ $value == "" ]]; then
          echo -e "\e[0;31m${bold}Error - Value for $key cannot be empty. Please fill this value${normal}"; fail=1
       fi
       ;;
esac
done

if [[ $fail -eq 1 ]]; then
   echo -e "\e[0;34m${bold}azure_container_Config file has errors. Please rectify the issues and restart the installation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}azure_container_Config file successfully validated${normal}"
fi

