#!/bin/bash 


get_config_values(){
key=$1
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' datasource_config.yml)
}

check_datasource_config(){
if ! [[ $2 == "true" || $2 == "false" ]]; then
    echo "Error - Please enter either true or false for $1"; fail=1
fi
}

bold=$(tput bold)
normal=$(tput sgr0)
fail=0
if [[ ! $# -eq 0 ]]; then
   core_install=$1
else
   core_install="NA"
fi

echo "Validating the Datasource config file..."

# An array of mandatory values
declare -a arr=("nifi_crc" "nifi_attendance" "nifi_semester" "nifi_infra" "nifi_diksha" "nifi_telemetry" "nifi_udise" "nifi_pat" "nifi_composite" "nifi_healthcard")

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Iterate the array and retrieve values for mandatory fields from config file
for i in ${arr[@]}
do
get_config_values $i
done

for i in ${arr[@]}
do
key=$i
value=${vals[$key]}
case $key in
   nifi_crc)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_attendance)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_semester)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_infra)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_diksha)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_telemetry)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_udise)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_pat)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_composite)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
       fi
       ;;
  nifi_healthcard)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_datasource_config $key $value
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
   echo -e "\e[0;34m${bold}datasource_config file has errors. Please rectify the issues and restart the process${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}datasource_config file successfully validated${normal}"
fi
