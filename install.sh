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

chmod u+x validate.sh

if [[ ! -f config.yml ]]; then
    tput setaf 1; echo "ERROR: config.yml is not available. Please copy config.yml.template as config.yml and fill all the details."; tput sgr0
    exit;
fi
aws --version >/dev/null 2>&1
if [ $? -ne 0 ]; then 
    . "$INS_DIR/validation_scripts/install_aws_cli.sh"
fi
. "validate.sh"


if [ -e /etc/ansible/ansible.cfg ]; then
	sudo sed -i 's/^#log_path/log_path/g' /etc/ansible/ansible.cfg
fi

echo '127.0.0.0' >> /etc/ansible/hosts

if [ ! $? = 0 ]; then
tput setaf 1; echo "Error there is a problem installing Ansible"; tput sgr0
exit
fi
ansible-playbook ansible/create_base.yml --tags "install" --extra-vars "@config.yml"
ansible-playbook ansible/install.yml --tags "install"
if [ $? = 0 ]; then
echo "cQube Base installed successfully!!"
fi
