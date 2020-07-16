README.md
cQube
Prerequisites:
  Google Chrome 83.0.4103.106 need to be installed in the server or local machine.
  cQubeTesting project need to be cloned from the github.
  
Steps to install the google chrome

  Open the terminal (Ctrl+Alt+t) in the ubuntu
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  sudo apt install ./google-chrome-stable_current_amd64.deb
  
Steps to execute the test scripts

	1.Open the Terminal (Ctrl+Alt+t) in the ubuntu
	2.sudo apt update
	3.sudo apt install python3-pip
	4.Execute the Requirement.txt in the terminal (Requirement.txt file present in the cQubeTesting Folder)
	    pip3 install -r Requirement.txt
	5.Fill the config.ini file (config.ini file present in the cQubeTesting Folder)

	  [config]
	  domain=   #Enter the url of the cqube application ex: https://<domainname>/ or http://<ip>:4200
	  username= #Enter the username of report viewer  
	  password= #Enter the password of report viewer
	 
	  admin_domain=     #Enter the url of vpn based admin cQube url
	  admin_username=   #Enter the username of admin  
	  admin_password=   #Enter the password of admin	 
	  
	  please fallow the steps for run testscripts for admin console
	  	1> open vpn based url in browser 
		   click on advanced --> open unsecured link --> login to openvpn access server  
		2> click on user-profile and starts downloading client.ovpn 
		2> open terminal with directory of client.ovpn is located
		3> check version of openvpn ,if not exist use command to install : sudo apt-get install openvpn
		4> sudo openvpn --config client.ovpn 
		5> provide author userid and password 
		6> note: dont close terminal , just open browser and navigate to cQube application 
		7> login with admin user and password , admin can access both cQube reports and admin console
	
	6.To Run the Test scripts
	    Navigate to cQubeTesting Directory in the terminal (ex cd /home/ubuntu/cQubeTesting)

	7.To Run Functionality Testing Suite:

		python3 -m unittest TestSuites/FunctionalTestSuite/Run_crc.py
		python3 -m unittest TestSuites/FunctionalTestSuite/Run_SchoolInfraMap.py
		python3 -m unittest TestSuites/FunctionalTestSuite/Run_SchoolInfraReport.py

	8.To Run Regression Testing Suite

		python3 -m unittest TestSuites/RegressionTestSuite/Run_Login_And_LandingPage.py
		python3 -m unittest TestSuites/RegressionTestSuite/Run_StudentAttendance.py
		python3 -m unittest TestSuites/RegressionTestSuite/Run_Crc.py
		python3 -m unittest TestSuites/RegressionTestSuite/Run_Semester_Report.py
		python3 -m unittest TestSuites/RegressionTestSuite/Run_SchoolInfraMap.py
		python3 -m unittest TestSuites/RegressionTestSuite/Run_SchoolInfraReport.py

	9.To Execute Smoke Testing suite

		python3 -m unittest TestSuites/SmokeTestSuite/Smoke_Testing.py
		
	Note :
		Each Single scripts takes more than 4 to 5 hours, you can execute the multiple test scripts by opening the terminal and navigating to the cQubeTesting folder and running the above testing suite.





















