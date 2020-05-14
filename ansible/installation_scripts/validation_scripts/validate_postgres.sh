#!/bin/bash

VAL_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$VAL_DIR" ]]; then VAL_DIR="$PWD"; fi

temp=$(psql -V > /dev/null 2>&1; echo $?)

if [ $temp == 0 ]; then
    version=`psql -V | head -n1 | cut -d" " -f3`
    if [ $version>=10.12 ]
    then
        echo -n "Postgres is already present in this machine. Do you want to re-install it (yes/no)? "
        read answer
        if [[ $answer =~ ^(yes|YES)$ ]] ;then
             sudo apt-get --purge remove postgresql -y
             dpkg -l | grep postgres
             sudo apt-get --purge remove postgresql postgresql-doc postgresql-common -y
             sudo apt autoremove -y
         elif [[ $answer =~ ^(no|NO)$ ]] ;then
             tput setaf 1; echo "Aborting cQube installation, kindly uninstall postgres and start the installation"; tput sgr0
	     exit; 
         else
             echo "Please enter yes or no"
         fi
     fi
fi
