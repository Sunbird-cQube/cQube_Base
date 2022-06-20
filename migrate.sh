#!/bin/bash


source_bucket=$(awk ''/^source_s3_output_bucket:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
system_user_name=$(awk ''/^system_user_name:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

storage_type=$(awk ''/^storage_type:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)
base_dir=$(awk ''/^base_dir:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

installation_host_ip=$(awk ''/^installation_host_ip:' /{ if ($2 !~ /#.*/) {print $2}}' config.yml)

str_typ=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_STORAGE_TYPE )
src_type=$(cut -d "=" -f2 <<< "$str_typ")

db_usr=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_DB_USER )
database_user=$(cut -d "=" -f2 <<< "$db_usr")

db_name=$(cat $base_dir/cqube/.cqube_config | grep CQUBE_DB_NAME )
database_name=$(cut -d "=" -f2 <<< "$db_name")

cqube_cloned_path=$(awk ''/^cqube_cloned_path:' /{ if ($2 !~ /#.*/) {print $2}}' migrate_config.yml)
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
    pg_dump -h localhost -U $database_user -F t $database_name > $cqube_cloned_path/cQube_Base/bk_db_name.tar

fi

if [[ $storage_type == "s3" ]]; then
	pg_dump -h localhost -U $database_user -F t $database_name > $cqube_cloned_path/cQube_Base/bk_db_name.tar
fi


#Installing the cQube_Base and cQube_Workflow
if [ $? = 0 ]; then
	if [[ $storage_type == "s3" ]]; then
	ansible-playbook -i hosts ansible/remote_sanity.yml -e "my_hosts=$installation_host_ip" --tags "install"
		if [ $? = 0 ]; then
        	 echo "migration remote_sanity file validated  successfully!!"
    		fi
	fi		
fi
if [ $? = 0 ]; then
	if [[ $storage_type == "azure" ]]; then
	ansible-playbook -i hosts ansible/remote_sanity.yml -e "my_hosts=$installation_host_ip" --tags "install"
		if [ $? = 0 ]; then
      		echo "migration remote_sanity file validated  successfully!!"
    		fi
	fi
fi
if [ $? = 0 ]; then
	if [[ $storage_type == "local" ]]; then
	ansible-playbook -i hosts ansible/remote_sanity.yml -e "my_hosts=$installation_host_ip" --tags "install"
		if [ $? = 0 ]; then
       		echo "migration remote_sanity file validated  successfully!!"
    		fi
	fi
fi	
if [ $? = 0 ]; then
	if [[ $storage_type == "s3" ]]; then
	ansible-playbook -i hosts ansible/validate_remote_config.yml -e "my_hosts=$installation_host_ip" --tags "install"
		if [ $? = 0 ]; then
      		 echo "cQube migration config file validated  successfully!!"
    		fi
	fi	
fi
if [ $? = 0 ]; then
	if [[ $storage_type == "local" ]]; then
	ansible-playbook -i hosts ansible/validate_remote_config.yml -e "my_hosts=$installation_host_ip" --tags "install"
		if [ $? = 0 ]; then
      		echo "cQube migration config file validated  successfully!!"
    		fi
	fi
fi	
if [ $? = 0 ]; then
	if [[ $storage_type == "azure" ]]; then
	ansible-playbook -i hosts ansible/validate_remote_config.yml -e "my_hosts=$installation_host_ip" --tags "install"
		if [ $? = 0 ]; then
      		echo "cQube migration config file validated  successfully!!"
    		fi
	fi
fi	


if [ $? = 0 ]; then
 . "install_migration.sh"
 	if [ $? = 0 ]; then
	echo "cQube Base installed successfully on remote host!!"
  	fi
fi

if [ $? = 0 ]; then
  cd $cqube_cloned_path/cQube_Workflow/workflow_deploy/education_usecase && ./install_mig.sh && cd $cqube_cloned_path/cQube_Base
   	if [ $? = 0 ]; then
 	echo "cQube Workflow installed successfully on remote host!!"
    	fi
fi


## taking local storage and s3 output bucket backup
if [ $? = 0 ]; then
	if [[ $storage_type == "s3" ]]; then
	ansible-playbook -i hosts ansible/migrate_backup.yml -e "my_hosts=$installation_host_ip" --tags "install" --extra-vars "@aws_s3_config.yml"
		if [ $? = 0 ]; then
        	echo "cQube Data base and output files are restored to remote server successfully!!"
    		fi
	fi
fi
if [ $? = 0 ]; then
	if [[ $storage_type == "azure" ]]; then
	ansible-playbook -i hosts ansible/migrate_backup.yml -e "my_hosts=$installation_host_ip" --tags "install" --extra-vars "@azure_container_config.yml"
		if [ $? = 0 ]; then
        	echo "cQube Data base and output files are restored to remote server successfully!!"
    		fi
	fi
fi
if [ $? = 0 ]; then
	if [[ $storage_type == "local" ]]; then
	ansible-playbook -i hosts ansible/migrate_backup.yml -e "my_hosts=$installation_host_ip" --tags "install" --extra-vars "@local_storage_config.yml"
		if [ $? = 0 ]; then
        	echo "cQube Data base and output files are restored to remote server successfully!!"
    		fi

	fi
fi
if [ $? = 0 ]; then
	if [[ $src_type = "local" ]] && [[ $storage_type = "s3" ]]; then
	. "local_to_s3.sh"
		if [ $? = 0 ]; then
        	echo "cQube output directory files are restored to remote server successfully!!"
    		fi
	fi
fi

