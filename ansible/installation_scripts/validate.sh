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

check_timeout()
{
  if [[ $2 =~ ^[0-9]+[M|D]$  ]] ; then
        raw_value="$( echo "$2" | sed -e 's/[M|D]$//' )"
        if [[ ! $raw_value == 0 ]]; then
		    if [[ $2 =~ M$ ]] ; then
		    	if [[ $raw_value -ge 30 && $raw_value -le 5256000 ]]; then 
		    		timeout_value=$(($raw_value*60))
		    	else
		    		echo "Error - Minutes should be between 30 and 5256000"; fail=1
		    	fi
		    fi
		    if [[ $2 =~ D$ ]] ; then
		    	if [[ $raw_value -ge 1 && $raw_value -le 3650 ]]; then 
		    		timeout_value=$(($raw_value*24*60*60))
		    	else
		    		echo "Error - Days should be between 1 and 3650"; fail=1
		    	fi
		    fi
		else
			echo "Error - Timeout should not be 0"; fail=1
	    fi
    else
        echo "Error - please enter proper value as mentioned in comments"; fail=1
    fi
sed -i '/session_timeout_in_seconds:/d' roles/keycloak/vars/main.yml
echo "session_timeout_in_seconds: $timeout_value" >> roles/keycloak/vars/main.yml
}

check_state()
{
state_found=0
while read line; do
  if [[ $line == $2 ]] ; then
   state_found=1
  fi
done < validation_scripts/state_codes
if [[ $state_found == 0 ]] ; then
  echo "Error - Invalid State code. Please refer the state_list file and enter the correct value."; fail=1
fi
}

check_static_datasource(){
if ! [[ $2 == "udise" || $2 == "state" ]]; then
    echo "Error - Please enter either udise or state for $1"; fail=1
fi
}

check_base_dir(){
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
  echo "Error - $1 Please enter the absolute path or make sure the directory is present."; fail=1
fi
}

check_version(){
if [[ ! "$base_dir" = /* ]] || [[ ! -d $base_dir ]]; then
    echo "Error - Please enter the absolute path or make sure the directory is present.";
    exit 1
else
   if [[ -e "$base_dir/cqube/.cqube_config" ]]; then
        installed_ver=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_VERSION )
        installed_version=$(cut -d "=" -f2 <<< "$installed_ver")
         echo "Currently cQube $installed_version version is installed in this machine. Follow Upgradtion process if you want to upgrade."
         echo "If you re-run the installation, all data will be lost"
	 while true; do
             read -p "Do you still want to re-run the installation (yes/no)? " yn
             case $yn in
                 yes) break;;
                 no) exit;;
                 * ) echo "Please answer yes or no.";;
             esac
         done
   fi
fi
}

check_kc_config_otp(){
if ! [[ $2 == "true" || $2 == "false" ]]; then
    echo "Error - Please enter either true or false for $1"; fail=1
fi
}

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
if [ $(( $mem_total / 1024 )) -ge 30 ] && [ $(($mem_total / 1024)) -le 60 ] ; then
  min_shared_mem=$(echo $mem_total*11.5/100 | bc)
  min_work_mem=$(echo $mem_total*2/100 | bc)
  min_java_arg_2=$(echo $mem_total*52/100 | bc)
  min_java_arg_3=$(echo $mem_total*71.5/100 | bc)
  echo """---
shared_buffers: ${min_shared_mem}MB
work_mem: ${min_work_mem}MB
java_arg_2: -Xms${min_java_arg_2}m
java_arg_3: -Xmx${min_java_arg_3}m""" > memory_config.yml

elif [ $(( $mem_total / 1024 )) -gt 60 ]; then
  max_shared_mem=$(echo $mem_total*10/100 | bc)
  max_work_mem=$(echo $mem_total*3/100 | bc)
  max_java_arg_2=$(echo $mem_total*40/100 | bc)
  max_java_arg_3=$(echo $mem_total*57/100 | bc)
  echo """---
shared_buffers: ${max_shared_mem}MB
work_mem: ${max_work_mem}MB
java_arg_2: -Xms${max_java_arg_2}m
java_arg_3: -Xmx${max_java_arg_3}m""" > memory_config.yml
else
  echo "Error - Minimum Memory requirement to install cQube is 32GB. Please increase the RAM size."; 
  exit 1
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
        is_local_ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'` > /dev/null 2>&1
        if [[ $ip_pass == 0 && $is_local_ip != *$2* ]]; then
            echo "Error - Invalid value for $key. Please enter the local ip of this system."; fail=1 
        fi
    else
        echo "Error - Invalid value for $key"; fail=1
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
            echo "Error - [ $1 : $2 ] Bucket not owned or not found. Please change the bucket name in config.yml"; fail=1
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
        echo "$2" | grep "[A-Z]" | grep "[a-z]" | grep "[0-9]" | grep "[@#$%^&*]" > /dev/null 2>&1
        if [[ ! $? -eq 0 ]]; then
            echo "Error - $1 should contain atleast one uppercase, one lowercase, one special character and one number. And should be minimum of 8 characters."; fail=1
        fi
    else
        echo "Error - $1 should contain atleast one uppercase, one lowercase, one special character and one number. And should be minimum of 8 characters."; fail=1
    fi
}

check_api_endpoint(){
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
declare -a arr=("diksha_columns" "state_code" "static_datasource" "system_user_name" "base_dir" "db_user" "db_name" "db_password" "s3_access_key" \
		"s3_secret_key" "s3_input_bucket" "s3_output_bucket" "s3_emission_bucket" \
		"aws_default_region" "local_ipv4_address" "api_endpoint" "keycloak_adm_passwd" "keycloak_adm_user" "keycloak_config_otp" "session_timeout") 

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Getting aws keys
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

# Getting base_dir
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

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
   
   diksha_columns)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_kc_config_otp $key $value
       fi
       ;;
   state_code)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_state $key $value
       fi
       ;;
   static_datasource)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_static_datasource $key $value
       fi
       ;;
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
   local_ipv4_address)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_ip $key $value
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
   keycloak_config_otp)
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
   api_endpoint)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_api_endpoint $key $value
       fi
       ;;
   aws_default_region)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check. Recommended value is ap-south-1"; fail=1
       else
           check_aws_default_region
       fi
       ;;
   session_timeout)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_timeout $key $value
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
