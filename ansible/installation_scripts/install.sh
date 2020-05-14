#!/bin/bash

if [ `whoami` != root ]; then
    tput setaf 1; echo Please run this script using sudo
    exit
else
    if [[ "$HOME" == "/root" ]]; then
        tput setaf 1; echo "Please run this script using normal user with 'sudo' privilege,  not as 'root'"
    fi
fi

INS_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$INS_DIR" ]]; then INS_DIR="$PWD"; fi

sudo apt update -y
sudo apt install python -y
chmod u+x $INS_DIR/validation_scripts/*.sh
sudo apt install unzip -y

if [[ ! -f vars/main.yml ]]; then
    tput setaf 1; echo "ERROR: vars/main.yml is not available. Please copy vars/main.yml.template as vars/main.yml and fill all the details."
    exit;
fi

. "$INS_DIR/validation_scripts/check_vars_file.sh"
. "$INS_DIR/validation_scripts/install_aws_cli.sh"
. "$INS_DIR/validation_scripts/validate_bucket_name.sh"
. "$INS_DIR/validation_scripts/validate_postgres.sh"

sudo apt-get install software-properties-common -y
sudo apt-add-repository ppa:ansible/ansible -y
sudo apt-get update -y
sudo apt install ansible -y

if [ ! $? = 0 ]; then
tput setaf 1; echo "Error there is a problem installing Ansible"
exit
fi
python3 nifi_config.py
ansible-playbook install.yml
if [ $? = 0 ]; then
echo "CQube installed successfully!!"
fi
