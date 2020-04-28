#!/bin/bash
sudo apt update -y
sudo apt-get install software-properties-common -y
sudo apt-add-repository ppa:ansible/ansible -y
sudo apt-get update -y
sudo apt install ansible -y

if [ ! $? = 0 ]; then
echo "There is a problem installing Ansible"
exit
fi
python3 nifi_config.py
ansible-playbook install.yml
if [ $? = 0 ]; then
echo "CQube installed successfully!!"
fi

