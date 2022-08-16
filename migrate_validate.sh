#!/bin/bash 

check_cqube_cloned_path(){
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
   echo "Error - $1 Please enter the absolute path or make sure the directory is present."; fail=1

fi

}
get_config_values(){
key=$1
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
}

bold=$(tput bold)
normal=$(tput sgr0)
fail=0
if [[ ! $# -eq 0 ]]; then
   core_install=$1
else
   core_install="NA"
fi

echo -e "\e[0;33m${bold}Validating the migrate config file...${normal}"


# An array of mandatory values
declare -a arr=("cqube_cloned_path")
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
   cqube_cloned_path)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_cqube_cloned_path $key $value
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
   echo -e "\e[0;34m${bold}Config file has errors. Please rectify the issues and restart the installation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}Migrate Config file successfully validated${normal}"
fi

