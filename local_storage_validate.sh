#!/bin/bash

check_directory(){
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
   echo "Error - $1 Please enter the absolute path or make sure the directory is present."; fail=1
fi
  dir_owner=`stat -c '%U' $2` 

  if ! [[ $dir_owner == $system_user_name ]]; then
    echo "Error - $1 directory owner not matchiing."; fail=1
  fi	 
   if ! [[ -r "$2" ]];  then
        echo "Error - '$1' please give read permission to directory."; fail=1
   fi
   if ! [[ -w "$2" ]];  then
        echo "Error - '$1' please give write permission to directory."; fail=1
   fi
   if ! [[ -x "$2" ]]; then
        echo "Error - '$1' please give execute permission to directory."; fail=1
   fi
   if ! [[ "$2" = */ ]]; then
	echo "Error - $1 Please make sure the absolute path values should end with '/'"; fail=1
   fi

}

get_local_storage_config_values(){
key=$1
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' local_storage_config.yml)
}

bold=$(tput bold)
normal=$(tput sgr0)
fail=0
if [[ ! $# -eq 0 ]]; then
   core_install=$1
else
   core_install="NA"
fi

echo -e "\e[0;33m${bold}Validating the local_storage_config file...${normal}"


# An array of mandatory values
declare -a arr=("input_directory" "output_directory" "emission_directory")

# Create and empty array which will store the key and value pair from config file
declare -A vals

system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

# Iterate the array and retrieve values for mandatory fields from config file
for i in ${arr[@]}
do
get_local_storage_config_values $i
done

for i in ${arr[@]}
do
key=$i
value=${vals[$key]}
case $key in

   input_directory)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_directory $key $value
       fi
       ;;
   output_directory)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_directory $key $value
       fi
       ;;
   emission_directory)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_directory $key $value
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
   echo -e "\e[0;34m${bold}local_storage_Config file has errors. Please rectify the issues and restart the installation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}local_storage_Config file successfully validated${normal}"
fi

