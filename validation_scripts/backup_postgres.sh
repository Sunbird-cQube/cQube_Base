#!/bin/bash

echo "Checking for Postgres ..."
temp=$(psql -V > /dev/null 2>&1; echo $?)

db_user=$(awk ''/^db_user:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
db_name=$(awk ''/^db_name:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
db_password=$(awk ''/^db_password:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' upgradation_config.yml)
export PGPASSWORD=$db_password

if [ $temp == 0 ]; then
    version=`psql -V | head -n1 | cut -d" " -f3`
    if [[ $(echo "$version >= 10.12" | bc) == 1 ]]
    then
        echo "WARNING - Postgres found, taking the backup to base directory.."
        pg_dump -h localhost -U $db_user -F t $db_name > $base_dir/cqube/postgres/backups/`date +%Y%m%d%H%M`$bk_db_name.tar
        if [[ ! $? == 0 ]]; then
            echo "There is a problem dumping the database"; tput sgr0 ;
	        exit 1
        else
            echo "Database backup is completed"
        fi
     fi
fi
