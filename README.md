<h1>Installation of CQube</h1>
<h3>For Ubuntu Linux</h3>

- Open Terminal
- Navigate to the directory where CQube has been downloaded or cloned 
```
cd cQube/ansible/installation_scripts/
```
- Fill the configuration details in ` vars/main.yml` ( AWS Secret Key & Access Key )
- Give the permission to install.sh file
```
chmod u+x install.sh
```
- Run the install.sh shell script file using sudo command
```
sudo ./install.sh
```
This script sets up the infra in a sequence as mentioned below:
  - Installs Ansible
  - Installs Openjdk
  - Installs Python3 and Pip
  - Installs Apache Nifi
  - Creates S3 buckets
  - Installs and configures SFTP
  - Installs Postgresql
  - Installs Node.js and Express framework

Once installation completed without any errors, you will see the following message. 
```CQube installed successfully!!``` 


<b>Post Installation </b>

<b>Uploading data to SFTP location</b>

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


