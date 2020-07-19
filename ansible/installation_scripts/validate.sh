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
  echo "Error - Please enter the absolute path or make sure the directory is present."; fail=1
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
    if [ $version>=10.12 ]
    then
        echo "WARNING: Postgres found."
        echo "Please select any option."
echo """1. Skip the Postgres installation (Will backup the data locally for future reference)
2. Re-install the Postgres (current database will not be backed-up )
3. Exit the installation
        """
  while true; do
      read -p "Enter the option: " answer
      case $answer in
          1 )
                read -p "Enter the database name: " bk_db_name
                read -p "Enter the Username: " bk_db_uname
                pg_dump -h localhost -U $bk_db_uname -W -F t $bk_db_name > `date +%Y%m%d%H%M`$bk_db_name.tar
                if [[ ! $? == 0 ]]; then
                    echo "There is a problem dumping the database"; tput sgr0 ; fail=1; break;
                fi
                echo "Backed up the database..."
                echo "Backup file will be uploaded to S3 bucket, once the installation completes."
		sudo sed -i "s/- include_tasks: install_postgress.yml/#&/g" roles/createdb/tasks/main.yml
        break
        ;;
            2 )
                echo "Removing Postgres..."
                sudo apt-get --purge remove postgresql -y
                dpkg -l | grep postgres
                sudo apt-get --purge remove postgresql postgresql-doc postgresql-common -y
                sudo apt autoremove -y
                echo "Done."
	break	
        ;;
            3 )
                tput setaf 1; echo "Please backup the database and rerun the installation"; tput sgr0 ; fail=1; break;
                exit;
            ;;
      * )     ;;
        esac
        done
     fi
fi
}

check_mem_variables(){
kb=`head -1 /proc/meminfo | awk '{ print $2 }'` #reading RAM size in kb
mb=`echo "scale=0; $kb / 1024" | bc` # to MB    #converting RAM size to mb

java_arg_2=$3
java_arg_3=$4
share_mem=$1 
work_mem=$2
java_arg_check=0
if [[ $4 =~ ^-Xmx[0-9]+[m|g]$ ]]; then
    raw_java_arg_3="$( echo "$4" | sed -e 's/^-Xmx//; s/[m|g]$//' )"
    if [[ $4 =~ g$ ]]; then 
        final_java_arg_3=$(($raw_java_arg_3*1024))
    else
        final_java_arg_3=$raw_java_arg_3
    fi
else
    echo "Error - Please enter the proper value in java_arg_3"; fail=1
    java_arg_check=1
fi

if [[ $3 =~ ^-Xms[0-9]+[m|g]$ ]]; then
    raw_java_arg_2="$( echo "$3" | sed -e 's/^-Xms//; s/[m|g]$//' )"
    if [[ $3 =~ g$ ]]; then
        final_java_arg_2=$(($raw_java_arg_2*1024))
    else
        final_java_arg_2=$raw_java_arg_2
    fi
else
    echo "Error - Please enter the proper value in java_arg_2"; fail=1
    java_arg_check=1
fi

if [[ $2 =~ ^[0-9]+(GB|MB)$ ]]; then
    raw_work_mem="$(echo $2 | sed -e 's/\(GB\|MB\)$//')"
    if [[ $2 =~ GB$ ]]; then
        final_work_mem=$(($raw_work_mem*1024))
    else
        final_work_mem=$raw_work_mem
    fi
else
    echo "Error - Please enter the proper value in work_memory"; fail=1
fi

if [[ $1 =~ ^[0-9]+(GB|MB)$ ]]; then
    raw_share_mem="$(echo $1 | sed -e 's/\(GB\|MB\)$//')"
    if [[ $1 =~ GB$ ]]; then
        final_share_mem=$(($raw_share_mem*1024))
    else
        final_share_mem=$raw_share_mem
    fi
else
    echo "Error - Please enter the proper value in share_memory"; fail=1
fi

#addition of all memories
if [[ $(($final_java_arg_2+$final_java_arg_3+$final_work_mem+$final_share_mem)) -ge $mb ]] ; then
    echo "Error - Memory values are more than the RAM size" ; fail=1
fi

#comparing if java2 is greater than java3
if [[ $java_arg_check == 0 ]]; then
    if [[ $final_java_arg_2 -ge $final_java_arg_3 ]]  ; then
       echo "Error - java_arg_2 should be less than java_arg_3"; fail=1
    fi
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
            echo "Error: [ $1 : $2 ] Bucket not owned or not found. Please change the bucket name in config.yml"; fail=1
        fi
fi
}

check_nifi_port(){
    port_status=$(sudo lsof -i:$2)
    if [ $? == 0 ]; then
        echo "Error - Port $2 is already running. Please change the port."; fail=1
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
            echo "Error - Password should contain atleast one uppercase, one lowercase, one special character and one number. And should be minimum of 8 characters."; fail=1
        fi
    else
        echo "Error - Password should contain atleast one uppercase, one lowercase, one special character and one number. And should be minimum of 8 characters."; fail=1
    fi
}

check_api_endpoint(){
if [[ ! $2 =~ ^https?://[0-9] ]]; then

   if [[ $2 =~ ^https?://[^-.@_][a-z0-9i.-]{2,}\.[a-z/]{2,}$ ]]; then
        temp_fqdn=`echo $1 | sed -E 's/http:\/\/|https:\/\///g'`
        if ! [[ ${#temp_fqdn} -le 255 ]]; then
         echo "Error - FQDN exceeding 255 characters. Please provide the proper api url for $1"; fail=1
        fi
    else
        echo "Error - Please provide the proper api url for $1"; fail=1
    fi

else
    ip_api=$(echo "$2" | grep -o -P '(?<=//).*(?=:)')
    public_ip=$(dig +short myip.opendns.com @resolver1.opendns.com)
    if [[ ! "$ip_api" =~ ^(([1-9]?[0-9]|1[0-9][0-9]|2([0-4][0-9]|5[0-5]))\.){3}([1-9]?[0-9]|1[0-9][0-9]|2([0-4][0-9]|5[0-5]))$ ]]; then
        echo "Error - Public IP validation failed. Please provide the correct value of $1"; fail=1
        else
          if [[ ! $ip_api == $public_ip ]] ; then
            echo "Error - Public IP validation failed. Please provide the correct value of $1"; fail=1
          fi
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
declare -a arr=("system_user_name" "base_dir" "db_user" "db_name" "db_password" "nifi_port" "s3_access_key" "s3_secret_key" \
		"s3_input_bucket" "s3_output_bucket" "s3_emission_bucket" "shared_buffers" "work_mem" "java_arg_2" "java_arg_3" \
		"aws_default_region" "local_ipv4_address" "api_endpoint" "keycloak_adm_passwd" "keycloak_adm_user" "db_connection_url" "db_driver_dir" \
		"db_driver_class_name" "nifi_error_dir") 

# Create and empty array which will store the key and value pair from config file
declare -A vals

# Getting aws keys
aws_access_key=$(awk ''/^s3_access_key:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
aws_secret_key=$(awk ''/^s3_secret_key:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

# Getting memory args
shared_buffers=$(awk ''/^shared_buffers:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
work_mem=$(awk ''/^work_mem:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
java_arg_2=$(awk ''/^java_arg_2:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
java_arg_3=$(awk ''/^java_arg_3:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

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
   nifi_port)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_nifi_port $key $value
       fi
       ;;
   db_user)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
	  check_postgres
          check_db_naming $key $value
       fi
       ;;
   db_name)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_db_naming $key $value
       fi
       ;;
   keycloak_adm_user)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_db_naming $key $value
       fi
       ;;
   keycloak_adm_passwd)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_db_password $key $value
       fi
       ;;
   db_password)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_db_password $key $value
       fi
       ;;
   api_endpoint)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
          check_api_endpoint $key $value
       fi
       ;;
   db_connection_url)
       if [[ ! "$value" =~ ^(jdbc:postgresql://localhost:5432/)$ ]]; then
          echo "Error - Valid values for $key is jdbc:postgresql://localhost:5432/"; fail=1
       fi
       ;;
   db_driver_dir)
       if [[ ! "$value" =~ ^(jars/postgresql-42.2.10.jar)$ ]]; then
          echo "Error - Valid values for $key is jars/postgresql-42.2.10.jar"; fail=1
       fi
       ;;
   db_driver_class_name)
       if [[ ! "$value" =~ ^(org.postgresql.Driver)$ ]]; then
          echo "Error - Valid values for $key is org.postgresql.Driver"; fail=1
       fi
       ;;
   shared_buffers)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       fi
       ;;
   work_mem)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       fi
       ;;
   java_arg_2)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       fi
       ;;
   java_arg_3)
       if [[ $value == "" ]]; then
          echo "Error - Value for $key cannot be empty. Please fill this value"; fail=1
       else
           check_mem_variables $shared_buffers $work_mem $java_arg_2 $java_arg_3
       fi
       ;;
   nifi_error_dir)
       if [[ ! "$value" =~ ^(/cqube/nifi/nifi_errors)$ ]]; then
          echo "Error - Valid values for $key is /cqube/nifi/nifi_errors"; fail=1
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
