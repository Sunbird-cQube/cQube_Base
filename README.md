<h1>Installation of CQube</h1>
<h3>For Linux</h3>

- Open Terminal
- Navigate to the directory where CQube has been downloaded or cloned 
```
cd cQube/ansible/installation_scripts/
```
- Fill the required configuration values in ` vars/main.yml`
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

<b>Uploading data file to SFTP</b>

- Open Terminal
- ```sudo su```
- ```cat /home/<username>/.ssh/id_rsa```
- copy id_rsa to local machine where you have the data files
- Give the 400 permission to id_rsa file using ```chmod 400 id_rsa```
- Connect to sftp using ```sftp -i id_rsa <username>@<host_name_or_ip>```
- Put the data files into it
- See the output in ```http://<host_name_or_ip>:4200```
