#!/bin/bash

echo "Checking for Postgres ..."
temp=$(psql -V > /dev/null 2>&1; echo $?)

if [ $temp == 0 ]; then
    version=`psql -V | head -n1 | cut -d" " -f3`
    if [ $version>=10.12 ]
    then
        echo "WARNING: Postgres found, Kindly take the backup"
                read -p "Enter the database name: " bk_db_name
                read -p "Enter the Username: " bk_db_uname
                pg_dump -h localhost -U $bk_db_uname -W -F t $bk_db_name > `date +%Y%m%d%H%M`$bk_db_name.tar
                if [[ ! $? == 0 ]]; then
                    echo "There is a problem dumping the database"; tput sgr0 ;
		    exit 1
	        else
                  echo "Backed up the database..."
                  echo "Backup file will be uploaded to S3 bucket, once the installation completes."
	        fi
     fi
fi
