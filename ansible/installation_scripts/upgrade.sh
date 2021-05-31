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
chmod u+x upgradation_validate.sh

. "upgradation_validate.sh"
. "$INS_DIR/validation_scripts/datasource_config_validation.sh"

ansible-playbook create_base.yml --tags "update" --extra-vars "@upgradation_config.yml"

. "$INS_DIR/validation_scripts/backup_postgres.sh"

if [ -e /etc/ansible/ansible.cfg ]; then
	sudo sed -i 's/^#log_path/log_path/g' /etc/ansible/ansible.cfg
fi
ansible-playbook upgrade.yml --tags "update"
if [ $? = 0 ]; then
echo "cQube upgraded successfully!!"
fi

