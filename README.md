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
Configuration filled in `config.yml` will be validated first. If there is any error while validation, the installation will be aborted. In such case, solve the errors and restart the installation `sudo  ./install.sh`

Once installation completed without any errors, you will be prompted the following message. 
```CQube installed successfully!!``` 


<b>Post Installation </b>

<b> Creating Users and authentication with Keycloak </b>

-Creating initial admin user
Go to ```http://<host_name_or_ip>:8080/auth/admin/``` log in to the Keycloak Admin Console by creating an initial admin user

-Creating a New Realm:
Before you can create your first realm, complete the installation of Keycloak and create the initial admin user.
To create a new realm, complete the following steps,

Go to http://localhost:8080/auth/admin/ and log in to the Keycloak Admin Console using the account you created in Install and Boot. 
From the Master drop-down menu, click Add Realm. When you are logged in to the master realm this drop-down menu lists all existing realms. 
Type demo in the Name field and click Create.

When the realm is created, the main admin console page opens. Notice the current realm is now set to demo. Switch between managing the master realm and the realm you just created by clicking entries in the Select realm drop-down menu.


Creation of client & configuration:
Log in to the admin console with your admin account. 
In the top left drop-down menu select and manage the Demo realm. 
Click Clients in the left side menu to open the Clients page.
On the right side, click Create.
Complete the fields.
Click Save to create the client application entry. 
Click the Installation tab in the Keycloak admin console to obtain a configuration template. 
Select Keycloak OIDC JBoss Subsystem XML to generate an XML template. 



Client configuration:

Creating a New User:
To create a new user in the demo realm, along with a temporary password for that new user, complete the following steps,

From the menu, click Users to open the user list page. 
On the right side of the empty user list, click Add User to open the add user page. 
Enter a name in the Username field; this is the only required field. Flip the Email Verified switch from Off to On and click Save to save the data and open the management page for the new user.
 Click the Credentials tab to set a temporary password for the new user. 
Type a new password and confirm it. 
Click Set Password to set the user password.

Creating User

<b>Uploading data to S3 Emission bucket</b>

Create `cqube_emission` directory and place the data files as shown in file structure below inside the cqube_emission folder.

```
cqube_emission
.
├── block_master
│   └── block_mst.zip
├── cluster_master
│   └── cluster_mst.zip
|── district_master
|   └── district_mst.zip
├── school_master
│   └── school_mst.zip
|
|── semester
|   └── semester.zip
├── user_location_master
│   └── user_location_master.zip
|── inspection_master
|   └── inspection_master.zip
├── student_attendance
    └── student_attendance.zip

```
- After creating the emission user, Update below mentioned emission user details in `cQube/development/python/client/config.py`.
  - emission username 
  - emission password
  - location of the cqube_emission directory where the files are placed as below. Example: `/home/ubuntu/cqube_emission/`

- After completing the configuration. Save and close the file.
- Execute the client.py file located in `cQube/development/python/client/` directory, as mentioned below to emit the data files to s3_emission bucket. 
```
python3 client.py
```
- Make sure the ports 3000, 4200 and 5000 are accessible through the system firewall
- Finally see the output in ```http://<host_name_or_ip>:4200```
