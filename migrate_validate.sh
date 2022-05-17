#!/bin/bash 

check_ip()
{
    local ip=$2
    ip_stat=1
    ip_pass=0

    if [[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        OIFS=$IFS
        IFS='.'
        ip=($ip)
        IFS=$OIFS
        [[ ${ip[0]} -le 255 && ${ip[1]} -le 255 \
            && ${ip[2]} -le 255 && ${ip[3]} -le 255 ]]
        ip_stat=$?
        if [[ ! $ip_stat == 0 ]]; then
            echo "Error - Invalid value for $key"; fail=1
            ip_pass=0
        fi
    else
        echo "Error - Invalid value for $key"; fail=1
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


bold=$(tput bold)
normal=$(tput sgr0)
fail=0
if [[ ! $# -eq 0 ]]; then
   core_install=$1
else
   core_install="NA"
fi

echo -e "\e[0;33m${bold}Validating the config file...${normal}"


# An array of mandatory values
declare -a arr=("installation_host_ip")

# Create and empty array which will store the key and value pair from config file
declare -A vals

installation_host_ip=$(awk ''/^installation_host_ip:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)

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
   installation_host_ip)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_ip $key $value
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
   echo -e "\e[0;34m${bold}Config file has errors. Please rectify the issues and restart the upgradation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}Config file successfully validated${normal}"
fi

