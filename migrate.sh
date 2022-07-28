#!/bin/bash


system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)
storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/config.yml)

database_user=$(awk -F'CQUBE_DB_USER=' '{print $2}' $base_dir/cqube/.cqube_config)
database_name=$(awk -F'CQUBE_DB_NAME=' '{print $2}' $base_dir/cqube/.cqube_config)
cqube_output_directory=$(awk -F'CQUBE_OUTPUT_DIRECTORY=' '{print $2}' $base_dir/cqube/.cqube_config)

db_user=$(awk ''/^db_user:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)
db_name=$(awk ''/^db_name:' /{ if ($2 !~ /#.*/) {print $2}}' ~/cQube_Base/migrate_config.yml)
installation_host_ip=$(awk ''/^installation_host_ip:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)

chmod u+x migrate_validate.sh

if [[ ! -f migrate_config.yml ]]; then
    tput setaf 1; echo "ERROR: migrate_config.yml is not available. Please copy migrate_config.yml.template as migrate_config.yml and fill all the details."; tput sgr0
    exit;
fi

. "migrate_validate.sh"

INS_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$INS_DIR" ]]; then INS_DIR="$PWD"; fi

## taking the database backup in demo machine

if [[ $storage_type == "local" ]]; then
    pg_dump -h localhost -U $database_user -F t $database_name > /home/$system_user_name/bk_db_name.tar
fi

if [[ $storage_type == "s3" ]]; then
   pg_dump -h localhost -U $database_user -F t $database_name > /home/$system_user_name/bk_db_name.tar
fi

## taking local storage and s3 output bucket backup
if [[ $storage_type == "s3" ]]; then
ansible-playbook -i hosts ansible/migrate_backup.yml -e "my_hosts=$installation_host_ip" --tags "install" --extra-vars "@aws_s3_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/local_storage_config.yml" \
                                                                                                          --extra-vars "@$base_dir/cqube/conf/azure_container_config.yml"
fi
if [[ $storage_type == "azure" ]]; then
ansible-playbook -i hosts ansible/migrate_backup.yml -e "my_hosts=$installation_host_ip" --tags "install" --extra-vars "@azure_container_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/local_storage_config.yml" \
                                                                                                          --extra-vars "@$base_dir/cqube/conf/aws_s3_config.yml"
fi

if [[ $storage_type == "local" ]]; then
ansible-playbook -i hosts ansible/migrate_backup.yml -e "my_hosts=$installation_host_ip" --tags "install" --extra-vars "@local_storage_config.yml" \
                                                      --extra-vars "@$base_dir/cqube/conf/aws_s3_config.yml" \
                                                                                                          --extra-vars "@$base_dir/cqube/conf/azure_container_config.yml"

fi

. "bucket.sh"

if [ $? = 0 ]; then
        echo "cQube Data base and output files are restored to remote server successfully!!"
    fi

