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
Configuration filled in `config.yml` will be validated first. If there is any error while validation, the installation will be aborted. In such case, solve the errors and restart the installation `sudo  ./install.sh`

Once installation completed without any errors, you will be prompted the following message. 
```CQube installed successfully!!``` 


<b>Post Installation </b>

<b>Creating Data Emission User</b>

Goto the URL ```http://< host_name or host_ip >```
Note: URL depends upon the server configured in firewall (which includes SSL and reverse proxy)

- Login using the default username and password which are ```admin@cqube.com``` and ```admin123```
- Change your default password by navigating to top left cornor menu and clicking on User -> Change Password
- Login again with changed password
- Create emission user by navigating to top left cornor menu and clicking on User -> Create User
- Fill required fields and select the 'Select the role' as 'Data emission' and hit 'Create User' button
- Once user created successfully 'User added' message will pop up.

<b>Uploading data to S3 Emission bucket</b>

Create `cqube_emission` directory and place the data files as shown in file structure below inside the cqube_emission folder.

Master Files:
```
cqube_emission
|
├── block_master
│   └── block_mst.zip
├── cluster_master
│   └── cluster_mst.zip
├── district_master
│   └── district_mst.zip
├── inspection_master
│   └── inspectionmaster.zip
├── school_master
│   └── school_mst.zip
```

Transactional Files:
```
cqube_emission
|
├── semester
│   └── semester.zip
├── student_attendance
│   └── StudentAttendance.zip
└── user_location_master
	└── UserLocationMaster.zip
```

- Update below mentioned emission user details in `cQube/development/python/client/config.py`.
  - username ( fill the emission username which is created on 'Creating Data Emission User' section )
  - password ( fill the emission password which is created on 'Creating Data Emission User' section )
  - file_path ( location of the cqube_emission directory where the files are placed. Example: `/home/ubuntu/cqube_emission/` )
  - emission_url ( http://< host_name or host_ip >
  Note: URL depends upon the server configured in firewall which includes SSL and reverse proxy location)

- After completing the configuration. Save and close the file.
- NOTE: For first time installation. Emit the Master Files first followed by Transactional Files in a sequence.
(i.e.) client.py file has to be executed after placing Master Files and after placing Transactional Files.
- Execute the client.py file located in `cQube/development/python/client/` directory, as mentioned below to emit the data files to s3_emission bucket. 
```
python3 client.py
```
- Make sure the ports 3000, 4200 and 5000 are accessible through the system firewall
- Finally see the output in ```http://< host_name or host_ip >```
Note: URL depends upon the server configured in firewall (which includes SSL and reverse proxy)
