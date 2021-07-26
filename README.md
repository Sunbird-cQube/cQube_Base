# U# Upgradation from 2.0 to 3.0
###  Prerequisites to install cQube:
- ubuntu 18.04 Server (supported)
- 32GB of System RAM (minimum requirement)
- 8 core CPU (minimum requirement)
- Domain name (with SSL)
- 1 TB Storage
### Reverse proxy rules The following ports have to be configured in the nginix # server with reverse proxy:

- Port 4200 should be proxied to the '/'
- Port 8080 should be proxied to the '/auth'
- Port 3000 should be proxied to the '/api'
- Port 8000 should be proxied to the '/data'
### Nginx - cQube server firewall configuration

- Port 4200 should be open from nginx to the cQube server
- Port 8080 should be open from nginx to the cQube server
- Port 3000 should be open from nginx to the cQube server
- Port 8000 should be open from nginx to the cQube server
### Openvpn - cQube server firewall configuration

- Port 9000 should be open from openvpn to the cQube server
- Port 4201 should be open from openvpn to the cQube server
- Port 3001 should be open from openvpn to the cQube server
Note: For Installation: follow the below steps directly, for upgradation follow the Upgradation: steps mentioned in the last section.


# cQube_Base Installation:
- open Terminal
- Navigate to the directory where cQube_Base has been downloaded or cloned 
- cd cQube_Base/
- git checkout release-3.0
- Copy the config.yml.template to config.yml cp config.yml.template config.yml
- Edit using nano config.yml
- If you are opting for storage_type as s3. Copy the aws_s3_config.yml.template to aws_s3_config.yml cp aws_s3_config.yml.template aws_s3_config.yml
- Edit using nano aws_s3_config.yml
- If you are opting for storage_type as local. Copy the local_storage_config.yml.template to local_storage_config.yml cp local_storage_config.yml.template local_storage_config.yml
- Fill the configuration details for the below mentioned list in config.yml (* all the values are mandatory)
- cQube_Base installation process installs the components in a sequence as mentioned below:
  - Installs Ansible
  - Installs Openjdk
  - Installs Python, pip and flask
  - Installs Postgresql
  - Installs NodeJS
  - Installs Angular and Chart JS
  - Installs Apache Nifi
  - Installs Keycloak
  - Installs Grafana
  - Installs Prometheus and node exporter
- Save and Close the file

### Configuration of infrastructure attributes and udise data indices, metrics:

- Based on the number of infrastructure attributes required by the state, configure the infrastructure report by filling the required fields in the file infrastructure_master.csv:

- To edit below mentioned infrastructure details nano infrastructure_master.csv

- Save and Close the file

- Based on the number of udise attributes required by the state, configure the udise_config.csv file by filling the required fields in the file udise_config.csv:

- To edit below mentioned UDISE details nano udise_config.csv

- Save and Close the file

- For more information to configure the weights & columns for udise/infrastucture, please refer operational document.

- Update the diksha parameters(api_url,token,encryption key,dataset name channel_id,org_id) in the development/python/cQube-raw-data-fetch-parameters.txt

- Give the following permission to the install.sh file

  chmod u+x install.sh

- Install cQube using the non-root user with sudo privilege

- Configuration filled in config.yml will be validated first. If there is any error during validation, you will be prompted with the appropriate error message and the installation will be aborted. Refer the error message and solve the errors appropriately, then re-run the installation script sudo ./install.sh

- Start the installation by running install.sh shell script file as mentioned below:

  sudo ./install.sh

Once installation is completed without any errors, you will be prompted the following message. CQube installed successfully!!

# Steps cQube_Workflow Installation:

- Open Terminal

- Navigate to the directory where cQube_Workflow has been downloaded or cloned

  cd cQube_Workflow/work_deploy/

  git checkout release-3.0

- Copy the config.yml.template to config.yml cp config.yml.template config.yml
- if you are opting for education_usecase. usecase_name as education_usecase Copy the education_usecase_config.yml.template to education_usecase_config.yml cp education_usecase_config.yml.template education_usecase_config.yml
- if you are opting for test_usecase. usecase_name as test_usecase Copy the test_usecase_config.yml.template to test_usecase_config.yml cp test_usecase_config.yml.template test_usecase_config.yml
- Edit using nano config.yml

- Fill the configuration details for the below mentioned list in config.yml (* all the values are mandatory)

- cQube_Workflow installation process configuring the components in a sequence as mentioned below:

  - Configures Ansible
  - Configures Openjdk
  - Configures Python, pip and flask
  - Configures Postgresql
  - Configures NodeJS
  - Configures Angular and Chart JS
  - Configures Apache Nifi
  - Configures Keycloak
  - Configures Grafana
  - Configures Prometheus and node exporter


- Give the following permission to the install.sh file

  chmod u+x install.sh

- Install cQube using the non-root user with sudo privilege

- Configuration filled in config.yml will be validated first. If there is any error during validation, you will be prompted with the appropriate error message and the installation will be aborted. Refer the error message and solve the errors appropriately, then re-run the installation script sudo ./install.sh

- Start the installation by running install.sh shell script file as mentioned below:

  sudo ./install.sh

- Once installation is completed without any errors, you will be prompted the following message. CQube installed successfully!!

## Steps Post Installation:

### Steps to import Grafana dashboard

- Connect the VPN from local machine
Open https://<domain_name> from the browser and login with admin credentials
- Click on Admin Console
- Click on Monitoring details icon
- New tab will be loaded with grafana login page on http://<private_ip_of_cqube_server>:9000
- Default username is admin and password is admin
- Once your logged in change the password as per the need
- After logged in. Click on Settings icon from the left side menu.
- Click Data Sources
- Click on Add data source and select Prometheus
- In URL field, fill http://<private_ip_of_cqube_server>:9090 Optionally configure the other settings.
- Click on Save
- On home page, click on '+' symbol and select Import
- Click on Upload JSON file and select the json file which is located in git repository cQube/development/grafana/cQube_Monitoring_Dashboard.json and click Import
- Dashboard is succesfully imported to grafana with the name of cQube_Monitoring_Dashboard

## Uploading data to S3 Emission bucket:
- Create cqube_emission directory and place the data files as shown in file structure below inside the cqube_emission folder.
Master Files:

cqube_emission
|
├── block_master
│   └── block_mst.zip
│       └── block_mst.csv
├── cluster_master
│   └── cluster_mst.zip
│       └── cluster_mst.csv
├── district_master
│   └── district_mst.zip
│       └── district_mst.csv
├── school_master
│   └── school_mst.zip
│       └── school_mst.csv
├── pat
│   └── periodic_exam_mst.zip
│       └── periodic_exam_mst.csv
├── pat
│   └── periodic_exam_qst_mst.zip
│       └── periodic_exam_qst_mst.csv
├── diksha
│   └── diksha_tpd_mapping.zip
│       └── diksha_tpd_mapping.csv
├── diksha
│   └── diksha_api_progress_exhaust_batch_ids.zip
│       └── diksha_api_progress_exhaust_batch_ids.csv
├── sat
│   └── semester_exam_mst.zip
│       └── semester_exam_mst.csv
├── sat
│   └── semester_exam_qst_mst.zip
│       └── semester_exam_qst_mst.csv
├── sat
│   └── semester_exam_subject_details.zip
│       └── semester_exam_subject_details.csv
├── school_category
│   └── school_category_master.zip
│       └── school_category_master.csv
├── school_management
│   └── school_management_master.zip
│       └── school_management_master.csv
├── sat
│   └── semester_exam_subject_details.zip
│       └── semester_exam_subject_details.csv
├── sat
│   └── semester_exam_grade_details.zip
│       └── semester_exam_grade_details.csv
├── pat
│   └── periodic_exam_subject_details.zip
│       └── periodic_exam_subject_details.csv
├── pat
│   └── periodic_exam_grade_details.zip
│       └── periodic_exam_grade_details.csv
Transactional Files:

cqube_emission
|
├── student_attendance
│   └── student_attendance.zip
│       └── student_attendance.csv
├── teacher_attendance
│   └── teacher_attendance.zip
│       └── teacher_attendance.csv
├── user_location_master
│   └── user_location_master.zip
│       └── user_location_master.csv
├── inspection_master
│   └── inspection_master.zip
│       └── inspection_master.csv
├── infra_trans
│   └── infra_trans.zip
│       └── infra_trans.csv
├── diksha
│   └── diksha.zip
│       └── diksha.csv
├── pat
│   └── periodic_exam_result_trans.zip
│       └── periodic_exam_result_trans.csv
├── sat
│   └── semester_exam_result_trans.zip
│       └── semester_exam_result_trans.csv
- For udise data file structure, please refer the operational document.

- After creating the emission user, Update the emission user details mentioned below in cQube/development/python/client/config.py.

  - emission username
  - emission password
  - location of the cqube_emission directory where the files are placed as below. Example: /home/ubuntu/cqube_emission/
  - emission_url ( https://<domain_name>/data Note: URL depends upon the server configured in firewall which includes SSL and reverse proxy location)
- After completing the configuration. Save and close the file.

- Execute the client.py file located in cQube/development/python/client/ directory, as mentioned below to emit the data files to s3_emission bucket.

  python3 client.py
- Finally see the output in https://<domain_name>

# Upgradation:
### cQube_Base Upgradation:

- Open Terminal
- Navigate to the directory where cQube has been downloaded or cloned
cd cQube_Base/
 git checkout release-3.0
- Copy the upgradation_config.yml.template to upgradation_config.yml cp upgradation_config.yml.template upgradation_config.yml
- If you are opting for storage_type as s3. Copy the aws_s3_upgradation_config.yml.template to aws_s3_upgradationconfig.yml cp aws_s3_upgradation_config.yml.template aws_s3_upgradation_config.yml
- If you are opting for storage_type as local. Copy the local_storage_upgradation_config.yml.template to local_storage_upgradation_config.yml cp local_storageupgradation_upgradation_config.yml.template local_storage_upgradation_config.yml
- This script will update the below cQube components:

  - Creates & Updates table,sequence,index in postgresql database
  - Updates NodeJS server side code
  - Updates Angular and Chart JS client side code
  - Updates & configure Apache Nifi template
  - Updates & configure Keycloak
- Fill the configuration details in upgradation_config.yml (* all the values are mandatory, make sure to fill the same configuration details which were used during installation)

- Edit using nano upgradation_config.yml

- Save and Close the file

- Give the following permission to the upgrade.sh file

  chmod u+x upgrade.sh
- Run the script to update cQube using the non-root user with sudo privilege
Start the upgradation by running upgrade.sh shell script file as mentioned below:
  sudo ./upgrade.sh

Configuration filled in upgradation_config.yml will be validated first. If there is any error during validation, you will be prompted with the appropriate error message and the upgradation will be aborted. Refer the error message and solve the errors appropriately. Restart the upgradation processsudo ./upgrade.sh

Once upgradation is completed without any errors, you will be prompted the following message. CQube upgraded successfully!!
