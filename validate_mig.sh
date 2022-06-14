#!/bin/bash 

check_length(){
    len_status=1
    str_length=${#1}
    if [[ $str_length -ge 3 && $str_length -le 63 ]]; then 
        len_status=0
        return $len_status;
    else 
        return $len_status;
    fi
}

check_base_dir(){
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
  echo "Error - $1 Please enter the absolute path or make sure the directory is present."; fail=1
fi
}


check_kc_config_otp(){
if ! [[ $2 == "true" || $2 == "false" ]]; then
    echo "Error - Please enter either true or false for $1"; fail=1
fi
}

check_postgres(){
echo "Checking for Postgres ..."
temp=$(psql -V > /dev/null 2>&1; echo $?)

if [ $temp == 0 ]; then
    version=`psql -V | head -n1 | cut -d" " -f3`
    if [[ $(echo "$version >= 10.12" | bc) == 1 ]]
    then
        echo "WARNING: Postgres found."
        echo "Removing Postgres..."
        sudo systemctl stop kong.service > /dev/null 2>&1
        sleep 5
        sudo systemctl stop keycloak.service > /dev/null 2>&1
        sleep 5
        sudo systemctl stop postgresql
        sudo apt-get --purge remove postgresql* -y
        echo "Done"
     fi
fi
}

check_mem(){
mem_total_kb=`grep MemTotal /proc/meminfo | awk '{print $2}'`
mem_total=$(($mem_total_kb/1024))

if [[ $mode_of_installation == "localhost" ]]; then
  if [ $(($mem_total / 1024)) -ge 7 ]; then
    local_shared_mem=$(echo $mem_total*13/100 | bc)
    local_work_mem=$(echo $mem_total*2/100 | bc)
    local_java_arg_2=$(echo $mem_total*13/100 | bc)
    local_java_arg_3=$(echo $mem_total*65/100 | bc)
    echo """---
shared_buffers: ${local_shared_mem}MB
work_mem: ${local_work_mem}MB
java_arg_2: -Xms${local_java_arg_2}m
java_arg_3: -Xmx${local_java_arg_3}m""" > memory_config.yml
  else
    "Error - Minimum Memory requirement to install cQube in localhost/single machine is 8GB. Please increase the RAM size.";
  fi
fi

if [[ $mode_of_installation == "public" ]]; then
    if [ $(( $mem_total / 1024 )) -ge 15 ] && [ $(($mem_total / 1024)) -le 60 ] ; then
        min_shared_mem=$(echo $mem_total*13/100 | bc)
        min_work_mem=$(echo $mem_total*2/100 | bc)
        min_java_arg_2=$(echo $mem_total*13/100 | bc)
        min_java_arg_3=$(echo $mem_total*65/100 | bc)
        echo """---
shared_buffers: ${min_shared_mem}MB
work_mem: ${min_work_mem}MB
java_arg_2: -Xms${min_java_arg_2}m
java_arg_3: -Xmx${min_java_arg_3}m""" > memory_config.yml
    elif [ $(( $mem_total / 1024 )) -gt 60 ]; then
        max_shared_mem=$(echo $mem_total*13/100 | bc)
        max_work_mem=$(echo $mem_total*2/100 | bc)
        max_java_arg_2=$(echo $mem_total*7/100 | bc)
        max_java_arg_3=$(echo $mem_total*65/100 | bc)
        echo """---
shared_buffers: ${max_shared_mem}MB
work_mem: ${max_work_mem}MB
java_arg_2: -Xms${max_java_arg_2}m
java_arg_3: -Xmx${max_java_arg_3}m""" > memory_config.yml
    else
        echo "Error - Minimum Memory requirement to install cQube is 32GB. Please increase the RAM size."; 
        exit 1
    fi
fi
}

check_sys_user(){
    result=`who | head -1 | awk '{print $1}'`
    if [[ `egrep -i ^$2: /etc/passwd ; echo $?` != 0 && $result != $2 ]]; then 
        echo "Error - Please check the system_user_name."; fail=1
    fi
}

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

check_vpn_ip()
{
    local ip=$2
    ip_stat=1
    ip_pass=0
if [[ $mode_of_installation == "localhost" ]]; then
    if [[ ! $2 == "127.0.0.1" ]]; then
        echo "Error - Please provide local vpn ip as 127.0.0.1 for localhost installation"; fail=1
    fi
fi
 if [[ $mode_of_installation == "public" ]]; then   
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
 fi  
}

check_db_naming(){
check_length $2
if [[ $? == 0 ]]; then
    if [[ ! $2 =~ ^[A-Za-z_]*[^_0-9\$\@\#\%\*\-\^\?]$ ]]; then
        echo "Error - Naming convention is not correct. Please change the value of $1."; fail=1
    fi
else
    echo "Error - Length of the value $1 is not correct. Provide the length between 3 and 63."; fail=1
fi
}

check_db_password(){
    len="${#2}"
    if test $len -ge 8 ; then
        echo "$2" | grep "[A-Z]" | grep "[a-z]" | grep "[0-9]" | grep "[@%^*!?]" > /dev/null 2>&1
        if [[ ! $? -eq 0 ]]; then
            echo "Error - $1 should contain atleast one uppercase, one lowercase, one special character and one number. And should be minimum of 8 characters."; fail=1
        fi
    else
        echo "Error - $1 should contain atleast one uppercase, one lowercase, one special character and one number. And should be minimum of 8 characters."; fail=1
    fi
}

check_storage_type(){
if [[ $mode_of_installation == "localhost" ]]; then
    if [[ ! $2 == "local" ]]; then
        echo "Error - Please provide storage type as local for localhost installation"; fail=1
    fi
fi
if [[ $mode_of_installation == "public" ]]; then
    if ! [[ $2 == "s3" || $2 == "local" ]]; then
        echo "Error - Please enter either s3 or local for $1"; fail=1
    fi
fi    
}
check_mode_of_installation(){
if ! [[ $2 == "localhost" || $2 == "public" ]]; then
    echo "Error - Please enter either localhost or public for $1"; fail=1
fi
}

check_api_endpoint(){
if [[ $mode_of_installation == "localhost" ]]; then
    if [[ ! $2 == "localhost" ]]; then
        echo "Error - Please provide api_endpoint as localhost forlocalhost installation"; fail=1
    fi
fi
if [[ $mode_of_installation == "public" ]]; then
    if [[ (( $2 =~ \-{2,} ))  ||  (( $2 =~ \.{2,} )) ]]; then
        echo "Error - Please provide the proper api endpoint for $1"; fail=1
    else
        if [[ $2 =~ ^[^-.@_][a-z0-9i.-]{2,}\.[a-z/]{2,}$ ]]; then
            if ! [[ ${#2} -le 255 ]]; then
            echo "Error - FQDN exceeding 255 characters. Please provide the proper api endpoint for $1"; fail=1
            fi
        else
            echo "Error - Please provide the proper api endpoint for $1"; fail=1
        fi
    fi
fi
}

get_config_values(){
key=$1
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
}

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
declare -a arr=("system_user_name" "base_dir" "db_user" "db_name" "db_password" "read_only_db_user" \
                " read_only_db_password" "storage_type" "mode_of_installation" \
	        "local_ipv4_address" "vpn_local_ipv4_address" "installation_host_ip" "proxy_host" "api_endpoint" "keycloak_adm_passwd" "keycloak_adm_user" \
		"report_viewer_config_otp") 

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Getting base_dir
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
mode_of_installation=$(awk ''/^mode_of_installation:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

check_mem
check_version 

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
   
   system_user_name)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_sys_user $key $value
       fi
       ;;
   base_dir)	 
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_base_dir $key $value
       fi
       ;;
   local_ipv4_address)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_ip $key $value
       fi
       ;;
   vpn_local_ipv4_address)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_vpn_ip $key $value
       fi
       ;;
   installation_host_ip)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_ip $key $value
       fi
       ;;   
   proxy_host)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_vpn_ip $key $value
       fi
       ;;	   
   db_user)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
	  	check_postgres     
          check_db_naming $key $value
       fi
       ;;	   
   db_name)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_naming $key $value
       fi
       ;;
   read_only_db_user)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_naming $key $value
       fi
       ;;
   keycloak_adm_user)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_naming $key $value
       fi
       ;;
   keycloak_adm_passwd)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_password $key $value
       fi
       ;;
   report_viewer_config_otp)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_kc_config_otp $key $value
       fi
       ;;
   db_password)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_password $key $value
       fi
       ;;
   read_only_db_password)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_password $key $value
       fi
       ;;
   storage_type)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_storage_type $key $value
       fi
       ;;
   mode_of_installation)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_mode_of_installation $key $value
       fi
       ;;
   api_endpoint)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_api_endpoint $key $value
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
   echo -e "\e[0;32m${bold}Config file successfully validated${normal}"
fi

