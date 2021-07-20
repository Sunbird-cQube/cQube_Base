#!/bin/bash

check_s3_bucket_naming()
{
s3_bucket_naming_status=0
if [[ $1 =~ ^[a-z0-9.-]*[^-]$ ]]; then
    if [[ (( $1 =~ \-{2,} ))  ||  (( $1 =~ \.{2,} )) || (( $1 == *\-\.* )) || (( $1 == *\.\-* )) || (( $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ )) ]]; then
        s3_bucket_naming_status=1
        return $s3_bucket_naming_status;
    fi
else
    s3_bucket_naming_status=1
    return $s3_bucket_naming_status;
fi
}

check_aws_key(){
    aws_key_status=0
    export AWS_ACCESS_KEY_ID=$1
    export AWS_SECRET_ACCESS_KEY=$2
    aws s3api list-buckets > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then echo "Error - Invalid aws access or secret keys"; fail=1
        aws_key_status=1
    fi
}

check_s3_bucket(){
if [[ $aws_key_status == 0 ]]; then
        bucketstatus=`aws s3api head-bucket --bucket "${2}" 2>&1`
        if [ ! $? == 0 ]
        then
            echo "Error - [ $1 : $2 ] Bucket not owned or not found. Please change the bucket name in aws_s3_config.yml"; fail=1
        fi
fi
}

check_aws_default_region(){
    region_len=${#2}
    if [[ $region_len -ge 9 ]] && [[ $region_len -le 15 ]]; then
        curl https://s3.$2.amazonaws.com > /dev/null 2>&1
        if [[ ! $? == 0 ]]; then
            echo "Error - There is a problem reaching the aws default region. Please check the $1 value." ; fail=1
        fi
    fi
}

get_aws_s3_config_values(){
key=$1
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
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
declare -a arr=("s3_access_key" "s3_secret_key" "s3_input_bucket" "s3_output_bucket" "s3_emission_bucket" "aws_default_region")

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Getting aws keys
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' aws_s3_config.yml)

# Iterate the array and retrieve values for mandatory fields from config file
for i in ${arr[@]}
do
get_aws_s3_config_values $i
done

for i in ${arr[@]}
do
key=$i
value=${vals[$key]}
case $key in

   s3_access_key)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       fi
       ;;
   s3_secret_key)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
      else
          check_aws_key $aws_access_key $aws_secret_key
       fi
       ;;
   s3_input_bucket)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_s3_bucket $key $value
       fi
       ;;
   s3_output_bucket)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_s3_bucket $key $value
       fi
       ;;
   s3_emission_bucket)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_s3_bucket $key $value
       fi
       ;;
   aws_default_region)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check. Recommended value is ap-south-1"; fail=1
       else
           check_aws_default_region
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
   echo -e "\e[0;34m${bold}aws_s3_Config file has errors. Please rectify the issues and restart the installation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}aws_s3_Config file successfully validated${normal}"
fi

