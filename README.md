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
git checkout release-1.1
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

<b>Creating Users and authentication with Keycloak:</b>

<b>Creating a New Realm:</b>

To Create a new realm, complete the following steps:
1) Go to ```https://<domain_name>/auth/``` and click on the Keycloak Administration Console. 
2) The login screen for keycloak will be displayed. Login using the username and password created during the cQube installation (username and password entered  for keycloak in the config.yml file). 
3) The Master drop-down menu is available on left navigation bar. Click on Add Realm, the add realm functionality appears on the right side window. 
4) Enter the name, select Enabled as 'on' and click on the create button. The realm is created and the admin console page is displayed.  The current realm is now set to the realm name you created. 

5) Once the realm is created and the screen is displayed, the following tabs will be displayed on the right hand side: General, Login, Keys, Email, Themes, Cache, Tokens, Client registration, Security Defenses.
6) Navigate to the tab 'tokens'
7) Scroll down to the section 'Access token Lifespan' and change the time to 30 minutes. Click on the save button
8) Navigate to the tab 'Security defenses, there are two tabs displayed - Headers, Brute force detection.
9) Go to the tab 'Brute force detection'. (this is a mandatory requirement)
10) Enable it by changing the toggle to On. Click on the save button. The Max login failures can be changed as per the requirement.


The following functions can be performed with the realm created:

SECTION - CONFIGURE

- Creation of client & configuration:

Three clients have to be created using this functionality. 
They are:
       1) Client for angular application (cQube dashboard) with the URL - ```https://<domain_name>/``` 
       2) Client for admin application (admin dashboard) with the URL - ```http://<local_IP:4201>/```
       3) Client for emission api with the URL- ```https://<domain_name>/data``` 

1) Log in to the admin console with your admin account. 
2) In the top left drop-down menu select and manage the realm which you created. 
3) Click on 'Clients' in the left side menu to open the Clients page.
4) On the right side, click Create.
5) Enter the fields, Client ID, and Root URL, the Client protocol will be 'openid-connect' by default.
6) Click Save to create the client. 
7) Follow the steps mentioned above to create all the three clients, for angular application, admin application and emission api

Note: Follow the additional steps mentioned below for the emission client created (this step is mandatory):
1) Click on the clients option in the left hand navigation bar
2) Open the emission client by clicking on the link in the right hand side. 
3) Click on the 'access type' tab
4) Select the 'Access Type' as confidential.
5) Go to the 'credentials' tab and copy the secret key given and paste it in the file mentioned in the file: `cQube/ansible/installation_scripts/config_keycloak.yml`

- Client Scopes

This section need not be changed 

-Roles:

1) In the left side menu click on the Roles sub menu. 
2) The roles realm is displayed in the right side screen.
3) Enter the role name, description and click on save. 
3) Use the Add role option available to create the following three roles (use the exact names mentioned below):
    1) admin
    2) report_viewer
    3) emission
4) Delete the roles 'offline_access' and 'uma_authorization', which are created by default. 

- Identity Providers

This section need not be changed 

- User Federation

This section need not be changed 

- Authentication

This section need not be changed 

SECTION - MANAGE

- Groups 

This section need not be changed 

- Users

To create a new user in your created realm, along with a temporary password for that new user, complete the following steps,

1) From the left navigation bar, click on Users. The User creation section will be displayed on the right hand side of the page. 
2) Click on the Add User button to open the add user page. 
Create a user with the keycloak username and keycloak password mentioned during the cQube installation process in the config.yml file. This user will be the default admin user name and password that will be used for all the apis. (this is a mandatory step). 
3) Enter information in all the fields, user enabled has to be set to 'ON' and email verified is set to 'OFF'. (The required user actions should be left as it is) 
4) Once the uer is created, the user screen is displayed with the tabs Details, Attributes, Credentials, Role Mappings, Groups, Consents, Sessions.
5) Click the Credentials tab to set a temporary password for the new user. 
6) Type a new password and confirm it. 
7) Click Set Password to set the user password.
8) Click on the Role mappings tab.
9) By default, the offline_access and uma_authorization roles are present in the Assigned Roles section. Remove these roles. (this is a mandatory step)
10) Assign either one of the following roles (only one role can be assigned per user) - admin, emission, report_viewer. 
11) Admin user can perform all the admin functionalities as well as view all the reports, emission user can emit the data files and the report viewer can view all the reports.
12) Click on 'view all users' button to view a list of all the users.

- Sessions 

This section need not be changed

- Events

This section need not be changed

- Import

This section need not be changed

- Export

This section need not be changed


- After configuring the keycloak manually using the browser, fill the configurations in file using the command mentioned below from the terminal at the same location (cQube/ansible/installation_scripts/)
```
nano config_keycloak.yml
```
- After filling all the details in the file, Run the following command:
```
sudo ansible-playbook integrate_keycloak.yml
```

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
  - emission_url ( https://<domain_name>/data Note: URL depends upon the server configured in firewall which includes SSL and reverse proxy location)

- After completing the configuration. Save and close the file.
- Execute the client.py file located in `cQube/development/python/client/` directory, as mentioned below to emit the data files to s3_emission bucket. 
```
python3 client.py
```
- See the output in ```https://<domain_name>```

<b>Importing Grafana dashboard</b>

- Connect the VPN from local machine
- Open `https://<domain_name>` from the browser and login with admin credentials
- Click on Admin Console
- Click on Monitoring details icon
- New tab will be loaded with grafana login page on `http://<private_ip_of_cqube_server>:9000`
- Default username is admin and password is admin
- Once your logged in change the password as per the need
- After logged in. Click on Settings icon from the left side menu. 
- Click Data Sources 
- Click on Add data source and select Prometheus 
- In URL field, fill `http://<private_ip_of_cqube_server>:9090` Optionally configure the other settings.
- Click on Save
- On home page, click on '+' symbol and select Import
- Click on 'Upload JSON file' and select the json file which is located in git repository `cQube/development/grafana/cQube_Monitoring_Dashboard.json`  and click Import
- Dashboard is succesfully imported to grafana with the name of cQube_Monitoring_Dashboard
