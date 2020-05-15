<h1>Installation of CQube</h1>
<h3>For Ubuntu Linux (ubuntu 18.04)</h3>

- Open Terminal
- Navigate to the directory where CQube has been downloaded or cloned 
```
cd cQube/ansible/installation_scripts/
git checkout cQube-release-new
```
- Copy the main.yml.template to main.yml inside vars directory
`cp vars/main.yml.template vars/main.yml`
- Fill the configuration details in ` vars/main.yml`
- Give the permission to install.sh file
```
chmod u+x install.sh
```
- Install cQube using the non-root user with sudo privilege
- After filling all the variables in `vars/main.yml` proceed with below step
- Run the install.sh shell script file as mentioned below
```
sudo ./install.sh
```
This script sets up the infra in a sequence as mentioned below:
  - Installs Ansible
  - Installs Openjdk
  - Installs Python, pip and flask
  - Installs Apache Nifi
  - Creates S3 buckets
  - Installs Postgresql
  - Installs NodeJS
  - Installs Angular and Chart JS

Configuration filled in `vars/main.yml` will be validated first. If there is any error while validation, the installation will be aborted. In such case, solve the errors and restart the installation `sudo  ./insatll.sh`

Once installation completed without any errors, you will be prompted the following message. 
```CQube installed successfully!!``` 


<b>Post Installation </b>

<b>Uploading data to S3 Emission bucket</b>

create cqube_emission directory and place below file structure in the cqube_emission folder.
```cqube_emission/
  school_master/school_mst.zip
  cluster_master/cluster_mst.zip
  block_master/block_mst.zip
  district_master/district_mst.zip
  roles_master/roles.zip
  users_master/users.zip
  student_attendance/student_attendance.zip```

Connect to emission database in postgres and manually add the emission user.

After adding the user, we need to configure the `cQube/development/python/client/config.py`
Update the emission username, password, and the directory where the files are placed.

example to set the directory path:`/home/ubuntu/cqube_emission/`

After completing the configuration upload the files using command `python3 client.py`

- Allow the ports 3000 and 4200 in firewall
- See the output in ```http://<host_name_or_ip>:4200```
