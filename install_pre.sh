#!/bin/bash

if [ `whoami` != root ]; then
    tput setaf 1; echo "Please run this script using sudo"; tput sgr0
    exit
else
    if [[ "$HOME" == "/root" ]]; then
        tput setaf 1; echo "Please run this script using normal user with 'sudo' privilege,  not as 'root'"; tput sgr0
    fi
fi

INS_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$INS_DIR" ]]; then INS_DIR="$PWD"; fi

sudo apt-get install software-properties-common -y
sudo apt-add-repository ppa:ansible/ansible-2.9 -y
sudo apt update -y
sudo apt upgrade -y
sudo apt install ansible -y
sudo apt install python -y
sudo apt-get install python3-pip -y
sudo apt-get install python-apt -y
sudo apt install unzip -y
sudo apt install net-tools -y 
sudo apt install awscli -y
chmod u+x validate_mig.sh

storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

str_typ=$(cat /home/$system_user_name/migration/cqube_config | grep CQUBE_STORAGE_TYPE )
src_type=$(cut -d "=" -f2 <<< "$str_typ")

. "install_aws_cli.sh"

if [[ ! -f config.yml ]]; then
    tput setaf 1; echo "ERROR: config.yml is not available. Please copy config.yml.template as config.yml and fill all the details."; tput sgr0
    exit;
fi

. "validate_mig.sh"


if [[ $src_type = "s3" ]] && [[ $storage_type = "s3" ]]; then
	   if [[ -f aws_s3_config.yml ]]; then
    	. "$INS_DIR/aws_s3_validate.sh"
  	 	else
      		echo "ERROR: aws_s3_config.yml is not available. Please copy aws_s3_config.yml.template as aws_s3_config.yml and fill all the details."  
       exit;
   	   fi
fi

if [[ $src_type = "local" ]] && [[ $storage_type = "local" ]]; then
        if [[ -f local_storage_config.yml ]]; then
         . "$INS_DIR/local_storage_validate.sh"
        else
            echo "ERROR: local_storage_config.yml is not available. Please copy local_storage_config.yml.template as local_storage_config.yml and fill all the details."
        exit;
        fi
fi


if [[ $src_type = "s3" ]] && [[ $storage_type = "local" ]]; then
   		if [[ -f local_storage_config.yml ]]; then
    	 . "$INS_DIR/local_storage_validate.sh"
    	else
        	echo "ERROR: local_storage_config.yml is not available. Please copy local_storage_config.yml.template as local_storage_config.yml and fill all the details."
        exit;
   		fi
fi
	

if [[ $src_type = "local" ]] && [[ $storage_type = "s3" ]]; then
       if [[ -f aws_s3_config.yml ]]; then
        . "$INS_DIR/aws_s3_validate.sh"
        else
            echo "ERROR: aws_s3_config.yml is not available. Please copy aws_s3_config.yml.template as aws_s3_config.yml and fill all the details."  
       exit;
       fi
fi


if [ -e /etc/ansible/ansible.cfg ]; then
        sudo sed -i 's/^#log_path/log_path/g' /etc/ansible/ansible.cfg
fi
