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
sudo apt install ansible -y
sudo apt install python -y
sudo apt-get install python3-pip -y
sudo apt-get install python-apt -y
sudo apt install unzip -y
sudo apt install net-tools -y 
sudo apt install awscli -y
chmod u+x validate_mig.sh

storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
remote_storage_type=$(awk ''/^remote_storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)

. "install_aws_cli.sh"

. "validate_mig.sh"

if [ -e /etc/ansible/ansible.cfg ]; then
        sudo sed -i 's/^#log_path/log_path/g' /etc/ansible/ansible.cfg
fi
