#!/bin/bash 

check_keycloak_credentials(){
if [[ $base_dir_status == 0 ]]; then  
    $base_dir/cqube/keycloak/bin/kcadm.sh get realms --no-config --server http://localhost:8080/auth --realm master --user $1 --password $2 > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then echo "Error - Invalid keycloak user or password"; fail=1
    fi
else
  "Error - Since provided base_dir is invalid, Unable to verify keycloak."; fail=1
fi
}

check_base_dir(){
base_dir_status=0
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
    echo "Error - Please enter the absolute path or make sure the directory is present."; fail=1
else
   if [[ -e "$2/cqube/.cqube_config" ]]; then
        dir=$(cat $2/cqube/.cqube_config | grep CQUBE_BASE_DIR )
        base_dir_path=$(cut -d "=" -f2 <<< "$dir")
        if [[ ! "$2" == "$base_dir_path" ]]; then
            echo "Error - Base directory should be same as previous installation directory"; fail=1
            base_dir_status=1
        fi
    else
       echo "Error - Base directory should be same as previous installation directory"; fail=1
    fi
fi
}

check_postgres(){
echo "Checking for Postgres ..."
temp=$(psql -V > /dev/null 2>&1; echo $?)
check_postgres_status=0
if [ ! $temp == 0 ]; then
    echo "Error - Unable to check the Postgres."; fail=1
    check_postgres_status=1
fi
}

check_sys_user(){
    who | grep $2 > /dev/null 2>&1
    result=$?
    if [[ `egrep -i ^$2: /etc/passwd ; echo $?` != 0 && $result != 0 ]]; then 
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
        is_local_ip=`ip a | grep $2` > /dev/null 2>&1
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
            echo "Error: [ $1 : $2 ] Bucket not owned or not found. Please change the bucket name in upgradation_config.yml"; fail=1
        fi
fi
}

check_db_naming(){
dir=$(cat $base_dir/cqube/.cqube_config | grep $3 )
temp_db_name=$(cut -d "=" -f2 <<< "$dir")
if [[ ! $temp_db_name == $2 ]]; then
   echo "Error - $1 should be same as previous installation"; fail=1
fi
}

check_db_password(){
if [[ $check_postgres_status == 0 ]]; then 
    export PGPASSWORD=$3
    psql -h localhost -d $1 -U $2 -c "\l" > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then echo "Error - Invalid Postgres credentials"; fail=1
    fi
else
   "Error - Since unable to check Postgres, credentials could not verified."; fail=1
fi
}

check_api_endpoint(){
if [[ $base_dir_status == 0 ]]; then  
    temp_ep=`grep '^KEYCLOAK_HOST =' $base_dir/cqube/dashboard/server_side/.env | awk '{print $3}' | sed s/\"//g`
    if [[ ! $temp_ep == "https://$2" ]]; then
        echo "Error - Change in domain name. Please verify the api_endpoint "; fail=1
    fi
else
    "Error - Since provided base_dir is invalid, Unable to verify keycloak."; fail=1
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
vals[$key]=$(awk ''/^$key:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
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
declare -a arr=("system_user_name" "base_dir" "db_user" "db_name" "db_password" "s3_access_key" "s3_secret_key" \
		"s3_input_bucket" "s3_output_bucket" "s3_emission_bucket" \
		"aws_default_region" "local_ipv4_address" "api_endpoint" "keycloak_adm_passwd" "keycloak_adm_user" "keycloak_config_otp")

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Getting aws keys
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)

#Getting base_dir
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)

#Getting keycloak_adm_user and keycloak_adm_passwd
keycloak_adm_user=$(awk ''/^keycloak_adm_user:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
keycloak_adm_passwd=$(awk ''/^keycloak_adm_passwd:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)

#Getting db_user, db_name and db_password
db_user=$(awk ''/^db_user:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
db_name=$(awk ''/^db_name:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
db_password=$(awk ''/^db_password:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)

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
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_sys_user $key $value
       fi
       ;;
   base_dir)	 
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_base_dir $key $value
       fi
       ;;
   s3_access_key)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       fi
       ;;
   s3_secret_key)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
      else
          check_aws_key $aws_access_key $aws_secret_key
       fi
       ;;
   s3_input_bucket)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_s3_bucket $key $value 
       fi
       ;;
   s3_output_bucket)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_s3_bucket $key $value 
       fi
       ;;
   s3_emission_bucket)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_s3_bucket $key $value 
       fi
       ;;
   local_ipv4_address)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_ip $key $value
       fi
       ;;
   db_user)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
	        check_postgres
          check_db_naming $key $value CQUBE_DB_USER
       fi
       ;;
   db_name)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_db_naming $key $value CQUBE_DB_NAME
       fi
       ;;
   keycloak_adm_user)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       fi
       ;;
   keycloak_adm_passwd)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_keycloak_credentials $keycloak_adm_user $keycloak_adm_passwd
       fi
       ;;
   db_password)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_db_password $db_name $db_user $db_password
       fi
       ;;
   api_endpoint)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_api_endpoint $key $value
       fi
       ;;
   aws_default_region)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value. Recommended value is ap-south-1"; fail=1
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
   echo -e "\e[0;34m${bold}Config file has errors. Please rectify the issues and restart the installation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}Config file successfully validated${normal}"
fi
