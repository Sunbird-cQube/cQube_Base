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

chmod u+x upgradation_validate.sh

if [[ ! -f config.yml ]]; then
    tput setaf 1; echo "ERROR: config.yml is not available. Please copy config.yml.template as config.yml and fill all the details."; tput sgr0
    exit;
fi

. "upgradation_validate.sh"
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

if [[ $storage_type == "azure" ]]; then
   az --version >/dev/null 2>&1
   if [ $? -ne 0 ]; then
     . "$INS_DIR/validation_scripts/install_azure_cli.sh"
   fi
fi

if [[ $storage_type == "s3" ]]; then
   aws --version >/dev/null 2>&1
   if [ $? -ne 0 ]; then
     . "$INS_DIR/validation_scripts/install_aws_cli.sh"
   fi
fi

if [[ $storage_type == "s3" ]]; then
    if [[ -f aws_s3_config.yml ]]; then
    . "$INS_DIR/aws_s3_upgradation_validate.sh"
   else
        echo "ERROR: aws_s3_config.yml is not available. Please copy aws_s3_config.yml.template as aws_s3_config.yml and fill all the details."  
       exit;
   fi	
fi

if [[ $storage_type == "azure" ]]; then
    if [[ -f azure_container_config.yml ]]; then
    . "$INS_DIR/azure_container_upgradation_validate.sh"
   else
        echo "ERROR: azure_container_config.yml is not available. Please copy azure_container_config.yml.template as azure_container_config.yml and fill all the details."
       exit;
   fi
fi

if [[ $storage_type == "local" ]]; then
    if [[ -f local_storage_config.yml ]]; then
    . "$INS_DIR/local_storage_upgradation_validate.sh"
   else
        echo "ERROR: local_storage_config.yml is not available. Please copy local_storage_config.yml.template as local_storage_config.yml and fill all the details."  
       exit;
   fi
fi
ansible-playbook ansible/create_base.yml --tags "update" --extra-vars "@config.yml" 

if [ -e /etc/ansible/ansible.cfg ]; then
	sudo sed -i 's/^#log_path/log_path/g' /etc/ansible/ansible.cfg
fi

storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
if [[ $storage_type == "s3" ]]; then
ansible-playbook ansible/upgrade.yml --tags "update" --extra-vars "@aws_s3_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/local_storage_config.yml" \
													  --extra-vars "@$base_dir/cqube/conf/azure_container_config.yml"

    if [ $? = 0 ]; then
        echo "cQube Base upgraded successfully!!"
    fi
fi
if [[ $storage_type == "azure" ]]; then
ansible-playbook ansible/upgrade.yml --tags "update" --extra-vars "azure_container_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/local_storage_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/aws_s3_config.yml"
    if [ $? = 0 ]; then
        echo "cQube Base upgraded successfully!!"
    fi
fi

if [[ $storage_type == "local" ]]; then
ansible-playbook ansible/upgrade.yml --tags "update" --extra-vars "@local_storage_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/aws_s3_config.yml" \
													  --extra-vars "@$base_dir/cqube/conf/azure_container_config.yml"
    if [ $? = 0 ]; then
        echo "cQube Base upgraded successfully!!"
    fi
fi



