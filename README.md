<h1>cQube_Base</h1>

# Upgradation from 1.13.1 to 2.0
###  Prerequisites to install cQube:
- ubuntu 18.04 (supported)
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
- git checkout release-2.0
- Copy the config.yml.template to config.yml cp config.yml.template config.yml
- Edit using nano config.yml
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

- Give the following permission to the install.sh file

  chmod u+x install.sh

- Install cQube using the non-root user with sudo privilege

- Configuration filled in config.yml will be validated first. If there is any error during validation, you will be prompted with the appropriate error message and the installation will be aborted. Refer the error message and solve the errors appropriately, then re-run the installation script sudo ./install.sh

- Start the installation by running install.sh shell script file as mentioned below:

  sudo ./install.sh

Once installation is completed without any errors, you will be prompted the following message. CQube installed successfully!!


- Save and Close the file

- Give the following permission to the install.sh file
```
chmod u+x upgrade.sh
```
- Run the script to update cQube using the non-root user with sudo privilege
- Start the upgradation by running upgrade.sh shell script file as mentioned below:
```
sudo ./upgrade.sh
```
Configuration filled in `upgradation_config.yml` will be validated first. If there is any error during validation, you will be prompted with the appropriate error message and the upgradation will be aborted. Refer the error message and solve the errors appropriately. Restart the upgradation process`sudo ./upgrade.sh`

Once upgradation is completed without any errors, you will be prompted the following message. 
```CQube upgraded successfully!!```
