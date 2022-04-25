#!/bin/bash


storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' cQube_Base/config.yml)

base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' cQube_Base/config.yml)

database_user=$(awk ''/^CQUBE_DB_NAME:' /{ if ($2 !~ /#.*/) {print $2}}' $base_dir/cqube/.cqube_config)
database_name=$(awk ''/^CQUBE_DB_NAME:' /{ if ($2 !~ /#.*/) {print $2}}' $base_dir/cqube/.cqube_config)

cqube_s3_output=$(awk ''/^CQUBE_S3_OUTPUT:' /{ if ($2 !~ /#.*/) {print $2}}' $base_dir/cqube/.cqube_config)
cqube_output_directory==$(awk ''/^CQUBE_OUTPUT_DIRECTORY:' /{ if ($2 !~ /#.*/) {print $2}}' $base_dir/cqube/.cqube_config)

db_user=$(awk ''/^db_user:' /{ if ($2 !~ /#.*/) {print $2}}' cQube_Base/config.yml)
db_name=$(awk ''/^db_name:' /{ if ($2 !~ /#.*/) {print $2}}' cQube_Base/config.yml)


## taking the database backup in demo machine

if [[ $storage_type == "local" ]]; then
   pg_dump -h localhost -U $database_user -F t $database_name > bk_db_name.tar
fi

if [[ $storage_type == "s3" ]]; then
   pg_dump -h localhost -U $database_user -F t $database_name > bk_db_name.tar
fi


## Installing the cQube_Base
cd ~/cQube_Base/ && ./install.sh


## Installing the cQube_Wokflow
cd ~/cQube_Workflow/workflow_deploy/education_usecase && ./install.sh


## restoring database after cqube installation in production machine
if [[ $storage_type == "s3" ]]; then
	if [[ $database_name == $db_name ]]; then
        pg_restore -h localhost -U $database_user -d $database_name /home/ubuntu/bk_db_name.tar -c
	fi	
fi

if [[ $storage_type == "local" ]]; then
        if [[ $database_name == $db_name ]]; then
        pg_restore -h localhost -U $database_user -d $database_name /home/ubuntu/bk_db_name.tar -c
        fi
fi


## restoring outbucket after cqube installation in production machine
if [[ $storage_type == "s3" ]]; then
s3_output_bucket=$(awk ''/^s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' cQube_Base/aws_s3_config.yml)	
   if [[ $cqube_s3_output == $s3_output_bucket ]]; then
   aws s3 sync s3://$cqube_s3_output s3://$s3_output_bucket
   fi
fi

## restoring datacentre output directory after cqube installation in production machine
if [[ $storage_type == "local" ]]; then
output_directory=$(awk ''/^output_directory:' /{ if ($2 !~ /#.*/) {print $2}}' cQube_Base/local_storage_config.yml)	
   if [[ $cqube_output_directory == $s3_output_bucket ]]; then
   cp -r $cqube_output_directory $s3_output_bucket
   fi
fi

