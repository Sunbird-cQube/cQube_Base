<h1>cQube</h1>

<b>Prerequisites to install cQube:</b>
- ubuntu 18.04 (supported)
- 32GB of System RAM (minimum requirement)
- 8 core CPU (minimum requirement)
- Domain name (with SSL)
- 1 TB Storage  

<b>Reverse proxy rules</b>
The following ports have to be configured in the nginix server with reverse proxy:
1) Port 4200 should be proxied to the '/' 
2) Port 8080 should be proxied to the '/auth'
3) Port 3000 should be proxied to the '/api'
4) Port 5000 should be proxied to the '/data'

<b>Openvpn - cQube server firewall configuration</b>
1) Port 9000 should be open from openvpn to the cQube server
2) Port 4201 should be open from openvpn to the cQube server
3) Port 3001 should be open from openvpn to the cQube server

<b>Installation:</b>
- Open Terminal
- Navigate to the directory where cQube has been downloaded or cloned 
```
cd cQube/ansible/installation_scripts/
git checkout cQube-release-new
```
- Copy the config.yml.template to config.yml 
`cp config.yml.template config.yml`
- This script installs the cQube components in a sequence as mentioned below:
  - Installs Ansible
  - Installs Openjdk
  - Installs Python, pip and flask
  - Creates S3 buckets
  - Installs Postgresql
  - Installs NodeJS
  - Installs Angular and Chart JS
  - Installs Apache Nifi
  - Installs Keycloak
  - Installs Grafana
  - Installs Prometheus and node exporter
- Fill the configuration details for the above mentioned list in `config.yml` (* all the values are mandatory)
- Edit using `nano config.yml`
- Save and Close the file

  <b>Configuration of infrastructure attributes:</b>
- Based on the number of infrastructure attributes required by the state, configure the infrastructure report by filling in the following fields in the file `infrastructure_master.csv`:
- Refer and use the file`nano infrastructure_master.csv` to edit the infrastructure details mentioned below. 
    - Infrastructure name
    - Infrastructure category 
    - Infrastructure status (True/ False) 
- Save and Close the file

- Give the following permission to the install.sh file
```
chmod u+x install.sh
```
- Install cQube using the non-root user with sudo privilege
- Start the installation by running install.sh shell script file as mentioned below:
```
sudo ./install.sh
```
Configuration filled in `config.yml` will be validated first. If there is any error during validation, you will be prompted with the appropriate error message and the installation will be aborted. Refer the error message and solve the errors appropriately. Restart the installation process`sudo ./install.sh`

Once installation is completed without any errors, you will be prompted the following message. 
```CQube installed successfully!!``` 

<b>Steps Post Installation:</b>

<b>Uploading data to S3 Emission bucket:</b>
- 
Create `cqube_emission` directory and place the data files as shown in file structure below inside the cqube_emission folder.

Master Files:
```
cqube_emission
|
├── block_master
│   └── block_mst.zip
│       └── block_mst.csv
│       └── manifest_datasource_block_mst.csv
├── cluster_master
│   └── cluster_mst.zip
│       └── cluster_mst.csv
│       └── manifest_datasource_cluster_mst.csv
├── district_master
│   └── district_mst.zip
│       └── district_mst.csv
│       └── manifest_datasource_district_mst.csv
├── school_master
│   └── school_mst.zip
│       └── school_mst.csv
│       └── manifest_datasource_school_mst.csv
```

Transactional Files:
```
cqube_emission
|
├── semester
│   └── semester.zip
│       └── semester.csv
│       └── manifest_datasource_semester.csv
├── student_attendance
│   └── student_attendance.zip
│       └── student_attendance.csv
│       └── manifest_datasource_student_attendance.csv
├── user_location_master
│   └── user_location_master.zip
│       └── user_location_master.csv
│       └── manifest_datasource_user_location_master.csv
├── inspection_master
│   └── inspection_master.zip
│       └── inspection_master.csv
│       └── manifest_datasource_inspection_master.csv
├── infra_trans
│   └── infra_trans.zip
│       └── infra_trans.csv
│       └── manifest_datasource_infra_trans.csv
```
    

- After creating the emission user, Update the emission user details mentioned below in `cQube/development/python/client/config.py`.
  - emission username 
  - emission password
  - location of the cqube_emission directory where the files are placed as below. Example: `/home/ubuntu/cqube_emission/`
  - emission_url ( `https://<domain_name>/data` Note: URL depends upon the server configured in firewall which includes SSL and reverse proxy location)

- After completing the configuration. Save and close the file.
- Execute the client.py file located in `cQube/development/python/client/` directory, as mentioned below to emit the data files to s3_emission bucket. 
```
python3 client.py
```
- Finally see the output in ```https://<domain_name>```
