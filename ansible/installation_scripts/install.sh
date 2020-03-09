#!/bin/bash
sudo apt update -y
sudo apt install ansible -y

if [ ! $? = 0 ]; then
echo "There is a problem installing Ansible"
exit
fi

ansible-playbook install_infra.yml
if [ $? = 0 ]; then
echo "CQube installed successfully!!"
fi

