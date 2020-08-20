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

sudo apt update -y
sudo apt install python -y
sudo apt-get install python-apt -y
sudo apt-get install python3-pip -y
sudo pip3 install glob2
chmod u+x validate.sh
sudo apt install unzip -y

if [[ ! -f config.yml ]]; then
    tput setaf 1; echo "ERROR: config.yml is not available. Please copy config.yml.template as config.yml and fill all the details."; tput sgr0
    exit;
fi

. "$INS_DIR/validation_scripts/install_aws_cli.sh"
. "validate.sh"
. "$INS_DIR/validation_scripts/datasource_config_validation.sh"

sudo apt-get install software-properties-common -y
sudo apt-add-repository ppa:ansible/ansible -y
sudo apt-get update -y
sudo apt install ansible -y

echo '127.0.0.0' >> /etc/ansible/hosts

if [ ! $? = 0 ]; then
tput setaf 1; echo "Error there is a problem installing Ansible"; tput sgr0
exit
fi

ansible-playbook install.yml --tags "install"
if [ $? = 0 ]; then
echo "CQube installed successfully!!"
fi
