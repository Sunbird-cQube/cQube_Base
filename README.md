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

cqube_emission_folder
lat_long/lat_long.zip
school_hierarchy/school_hierarchy.zip
roles_master/roles.zip
users_master/users.zip
student_attendance/student_attendance.zip


- In terminal, login as root by entering ```sudo su```
- Then ```cat /home/<username>/.ssh/id_rsa```
- Copy id_rsa to (local) machine where you have the data files to be uploaded
- Give the 400 permission to id_rsa file using ```chmod 400 id_rsa```
- Connect to sftp using ```sftp -i id_rsa <username>@<host_name_or_ip>```
- Put the data files into respective sftp directories as mentioned below
```
school_master_lat_long.json   ->   /cqube/data/s3_school_latlong
school_geo_master.csv   ->   /cqube/data/lat_long
student_attendance_sample.csv   ->   /cqube/data/emits
```
- Allow the ports 3000 and 4200 in firewall
- See the output in ```http://<host_name_or_ip>:4200```
