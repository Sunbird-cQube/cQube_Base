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

check_base_dir(){
if [[ ! "$2" = /* ]] || [[ ! -d $2 ]]; then
  echo "Error - $1 Please enter the absolute path or make sure the directory is present."; fail=1
fi
}

check_sys_user(){
    result=`who | head -1 | awk '{print $1}'`
    if [[ `egrep -i ^$2: /etc/passwd ; echo $?` != 0 && $result != $2 ]]; then
        echo "Error - Please check the system_user_name."; fail=1
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
check_directory(){
if [[ ! "$2" = /* ]]; then
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

check_cqube_cloned_path(){
if [[ ! "$2" = /* ]]; then
   echo "Error - $1 Please enter the absolute path or make sure the directory is present."; fail=1

   if ! [[ "$2" = */ ]]; then
     echo "Error - $1 Please make sure the absolute path values should end with '/'"; fail=1
   fi
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
declare -a arr=("remote_system_user_name" "base_dir" "remote_db_user" "remote_db_name" "remote_db_password" "remote_storage_type" "mode_of_installation" "s3_access_key" "s3_secret_key" "aws_default_region" "remote_s3_output_bucket" "remote_output_directory" "cqube_cloned_path")

# Create and empty array which will store the key and value pair from config file
declare -A vals

remote_system_user_name=$(awk ''/^remote_system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
mode_of_installation=$(awk ''/^mode_of_installation:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
remote_storage_type=$(awk ''/^remote_storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)

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
   remote_db_user)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_naming $key $value
       fi
       ;;	   
   remote_db_name)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_db_naming $key $value
       fi
       ;;
   remote_db_password)
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
   aws_default_region)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check. Recommended value is ap-south-1"; fail=1
       else
           check_aws_default_region
       fi
       ;;
   s3_output_bucket)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_s3_bucket $key $value
       fi
       ;;
   output_directory)
       if [[ $value == "" ]]; then
          echo "Error - in $key. Unable to get the value. Please check."; fail=1
       else
          check_directory $key $value
       fi
       ;;
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
   echo -e "\e[0;34m${bold}Config file has errors. Please rectify the issues and restart the upgradation${normal}"
   exit 1
else
   echo -e "\e[0;32m${bold}Config file successfully validated${normal}"
fi
