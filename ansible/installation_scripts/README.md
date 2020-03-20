<h1>Installation of CQube</h1>
<h3>For Linux</h3>

- Open Terminal
- Navigate to the directory where CQube has been downloaded or cloned 
```
cd cQube/ansible/installation_scripts/
```
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

If script fails anywhere, scripts stops and you will be shown with appropriate error message in red color.

<h4>Post Installation Configuration</h4> 

<b>Nifi Configuration</b>

Nifi will be accessible on `http://<your_hostname>:8080/nifi`

<b>Note: Make sure Port 8080 is open in firewall</b>

  1. Click on 'Upload Template' icon from the Operate Palette sits to the left-hand side of the screen as shown below <img src="images/Upload-template.png">
  2. Select the Template file `CQube-ver-0.1.xml` from `cQube/development/nifi` directory <br>Note: If you installed the NiFi in remote machine and viewing the NiFi UI in local machine, make sure you download or clone the same repository to local. <img src="images/Upload-template-option.png">
  3. Click on Upload button as shown below <img src="images/upload-template-success-selection.png">
  4. Once uploaded succcessfully, you will be prompted with following pop-up. Click 'OK'. <img src="images/successful-template-upload.png">
  5. To verify the uploaded template, Click `Templates` options <img src="images/menu-selection-.png">
  6. You will see the template in `NiFi Templates` list <img src="images/Templates-list.png">
  7. Next step is Instantiating template. Click and Drag the template icon as shown below <img src="images/import-template.png">
  8. Click on the drop down list and select the `CQube-ver-0.1` template. <img src="images/Select-template-into-nifi-ui.png">
  9. Click 'ADD' button and template will be added to canvas. <img src="images/import-template-selection.png">
  10. Double click on the `cQube Processor Group` to enter the group. <img src="images/successful-template-import.png">
  11. Right click on the canvas and Select `Parameters` option.  <img src="images/Paramter-option-select.png">
  12. Click the `+` icon to add Parameter Context <img src="images/Add-Paramter-context-select.png">
  13. Enter the Name as `ENVIRONMENT VARIABLES` and Click on  `PARAMETERS` tab <img src="images/Add-parameter-context name.png">
  14. Click on `+` icon to add the cQube configuration parameters <img src="images/Add-parameters.png">
  15. Enter the Name and Value and Click Apply to add the parameter <img src="images/Add-parameter-name-value.png">
  16. Below is an example to add the parameter with Sensitive Value <img src="images/Password-paramter-add.png">
  17. Once you click Apply, you will see List of parameters which you added. Repeat the step 14 to 16 to add the below mentioned parameters. Finally click on `Apply` button. <img src="images/Add-parameter-sucess.png">
  18. Once you click Apply, you will see list of Nifi Parameter Contexts <img src="images/parameter-contexts-list.png">
  19. Next step is to link the Parameter Context to cQube Processor Group. Click on Settings icon on Operate palette <img src="images/Select-settings.png">
  20. Under `General` tab, click the drop down of Process Group Parameter Context and select the `ENVIRONMENT VARIABLES` and click Apply <img src="images/Select-Parameter-context-name.png">
  21. Once successfully applied, you will be prompted as shown below. Click on OK <img src="images/Success-parameter-context.png">
  22. Click on `CONTROLLER SERVICES` tab to enable Controller services <img src="images/Controller-list.png">
  23. Click on `Enable` icon as shown <img src="images/Enable-controller-selection.png">
  24. Then click on `ENABLE` button <img src="images/Enable-Controllers.png">
  25. Once its enabled successfully, you can see the green Tick mark as shown below <img src="images/Enable-success.png">
  26. Repeat steps 24 to 26 to enable all Controller Services and close the cQube Configuration window <img src="images/Enable-success-all-controllers.png">
  27. Right click on canvas and select `Start` to start the Processor Group <img src="images/Start-all.png">
  28. Once all Processors started, you will see Green Play icon in all processors <img src="images/Success_start.png">
  
  



For Windows:
-----------

To install in Windows Machine use
./install.bat

--------To Do--------------------
