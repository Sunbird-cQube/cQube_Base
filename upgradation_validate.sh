#!/bin/bash 

check_keycloak_credentials(){
    $base_dir/cqube/keycloak/bin/kcadm.sh get realms --no-config --server http://localhost:8080/auth --realm master --user $1 --password $2 > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then 
        echo "Error - Invalid keycloak user or password"; fail=1
    fi

    $base_dir/cqube/keycloak/bin/kcadm.sh get realms/$realm_name --no-config --server http://localhost:8080/auth --realm master --user $1 --password $2 > /dev/null 2>&1
    if [ ! $? -eq 0 ]; then 
        echo "Error - Unable to find cQube realm"; fail=1
    fi
}

check_kc_config_otp(){
    if ! [[ $2 == "true" || $2 == "false" ]]; then
        echo "Error - Please enter either true or false for $1"; fail=1
    fi
}

check_base_dir(){
base_dir_status=0
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
    echo "Error - Please enter the absolute path or make sure the directory is present."; fail=1
    base_dir_status=1
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
       base_dir_status=1
    fi
fi
if [[ $base_dir_status == 1 ]]; then
  echo "Please rectify the base_dir error and restart the upgradation"
  exit 1
fi
}

check_version(){

# getting the installed version
if [[ ! "$base_dir" = /* ]] || [[ ! -d $base_dir ]]; then
    echo "Error - Please enter the absolute path or make sure the directory is present."; 
    exit 1
else
   if [[ -e "$base_dir/cqube/.cqube_config" ]]; then
        installed_ver=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_VERSION )
        installed_version=$(cut -d "=" -f2 <<< "$installed_ver")
    else
       echo "Error - Invalid base_dir or Unable to find the cQube in given base_dir";
       exit 1
    fi
fi

# getting this release version
if [[ -e ".version" ]]; then
    this_version=$(awk ''/^cqube_version:' /{ if ($2 !~ /#.*/) {print $2}}' .version)
    this_version=$(sed -e 's/^"//' -e 's/"$//' <<<"$this_version")
    if [[ $this_version == "" ]] || [[ ! `echo $this_version | grep -E '^[0-9]{1,2}\.[0-9]{1,2}\.?[0-9]{1,2}?$'` ]]; then
       echo "Error - cQube's constant settings are affected. Re-clone the repository again";
       exit 1 
    fi
else
   echo "Error - cQube's constant settings are affected. Re-clone the repository again";
   exit 1
fi

reupgrade=0
if [[ $installed_version == $this_version ]]; then
   echo "cQube is already upgraded to $this_version version.";
   while true; do
    read -p "Do you wish to rerun the upgrade (yes/no)? " yn
    case $yn in
        yes) 
	        reupgrade=1	
		      break;;
        no) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
fi

if [[ $reupgrade == 0 ]]; then
   if [[ ! $installed_version == $version_upgradable_from ]]; then
        echo "Version $this_version is only upgradeable from $version_upgradable_from version";
        exit 1
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

check_vpn_ip()
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

check_storage_type(){
	
if ! [[ $2 == "s3" || $2 == "local" ]]; then
    echo "Error - Please enter either s3 or local for $1"; fail=1
else
    if [[ -e "$base_dir/cqube/.cqube_config" ]]; then			
         typ=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_STORAGE_TYPE )
         strg_typ=$(cut -d "=" -f2 <<< "$typ")
         if [[ ! "$2" == "$strg_typ" ]]; then
             echo "Error - storage_type value should be same as previous installation storage_type"; fail=1
         fi	
     fi
fi
}

# Only for release 1.9
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

check_mode_of_installation(){
if ! [[ $2 == "public" || $2 == "localhost" ]]; then
    echo "Error - Please enter public or localhost for $1"; fail=1
fi
}

check_api_endpoint(){
if [[ -e "$base_dir/cqube/.cqube_config" ]]; then
	temp_ep=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_API_ENDPOINT )
    ep_typ=$(cut -d "=" -f2 <<< "$temp_ep")
    if [[ ! "$2" == "$ep_typ" ]]; then
    	echo "Change in domain name. Please verify the api_endpoint "; fail=1
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
    if [ $(( $mem_total / 1024 )) -ge 30 ] && [ $(($mem_total / 1024)) -le 60 ] ; then
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
declare -a arr=("system_user_name" "base_dir" "db_user" "db_name" "db_password" "storage_type" "mode_of_installation"  \
	        "local_ipv4_address" "vpn_local_ipv4_address" "proxy_host" "api_endpoint" "keycloak_adm_passwd" "keycloak_adm_user" \
		"report_viewer_config_otp")

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Constant variables
realm_name=cQube

# Getting base_dir
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

# Getting keycloak_adm_user and keycloak_adm_passwd
keycloak_adm_user=$(awk ''/^keycloak_adm_user:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
mode_of_installation=$(awk ''/^mode_of_installation:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
keycloak_adm_passwd=$(awk ''/^keycloak_adm_passwd:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

# Getting db_user, db_name and db_password
db_user=$(awk ''/^db_user:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
db_name=$(awk ''/^db_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
db_password=$(awk ''/^db_password:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

check_mem
# Check the version before starting validation
version_upgradable_from=3.5
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
          check_db_naming $key $value CQUBE_DB_USER
       fi
       ;;
   db_name)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_naming $key $value CQUBE_DB_NAME
       fi
       ;;
   keycloak_adm_user)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       fi
       ;;
   keycloak_adm_passwd)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_keycloak_credentials $keycloak_adm_user $keycloak_adm_passwd
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
          check_db_password $db_name $db_user $db_password
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
   echo -e "\e[0;34m${bold}Config file has errors. Please rectify the issues and restart the upgradation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}Config file successfully validated${normal}"
fi
