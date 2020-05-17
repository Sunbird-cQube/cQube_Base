<h1>cQube</h1>

<b>Prerequisites:</b>
- ubuntu 18.04 (recommended)
- 16GB of System RAM
- 4 core CPU

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
- Fill the configuration details for above mentioned list in `config.yml` (* all values are mandatory)
- Edit using `nano config.yml`
- Save and Close the file
- Give the permission to install.sh file
```
chmod u+x install.sh
```
- Install cQube using the non-root user with sudo privilege
- Start the installation by running install.sh shell script file as mentioned below
```
sudo ./install.sh
```
Configuration filled in `config.yml` will be validated first. If there is any error while validation, the installation will be aborted. In such case, solve the errors and restart the installation `sudo  ./insatll.sh`

Once installation completed without any errors, you will be prompted the following message. 
```CQube installed successfully!!``` 


<b>Post Installation </b>

<b>Uploading data to S3 Emission bucket</b>

Create cqube_emission directory and place below file structure in the cqube_emission folder.

```
cqube_emission
.
├── roles_master
│   └── roles.zip
├── static
│   ├── block_master
│   │   └── block_mst.zip
│   ├── cluster_master
│   │   └── cluster_mst.zip
│   ├── district_master
│   │   └── district_mst.zip
│   └── school_master
│       └── school_mst.zip
├── student_attendance
│   └── StudentAttenadance_8.zip
└── users_master
    └── users.zip
```
- Connect to emission database in postgres and manually add the emission user.
- After adding the user, we need to configure the `cQube/development/python/client/config.py`
- Update the emission username, password, and the directory where the files are placed.
- example to set the directory path:`/home/ubuntu/cqube_emission/`
- After completing the configuration upload the files using command `python3 client.py`

- Make sure the ports 3000, 4200, 8096 and 5000 are accessible through the system firewall
- Finally See the output in ```http://<host_name_or_ip>:4200```
