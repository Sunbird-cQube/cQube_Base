
cQube Release_1.2

Prerequisites:
  Google Chrome 84.0.4147.135 need to be installed in the server or local machine.
  Chrome driver 84.0.4147.30 need to be downloaded 
  cQubeTesting project need to be cloned from the github.
  
Steps to install the google chrome

  Open the terminal (Ctrl+Alt+t) in the ubuntu
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  sudo apt install ./google-chrome-stable_current_amd64.deb
 
Steps to Download the chrome driver 

   https://sites.google.com/a/chromium.org/chromedriver/downloads
   Unzip the chrome driver and place it in /usr/bin or /usr/local/bin.
   
Steps to Download the selenium Grid 
   
   https://www.selenium.dev/downloads/
   Download the latest stable selenium grid
   Open the terminal and navigate to the selenium grid jar
   Run the command in the terminal : java -jar selenium-server-standalone

Note : Java jdk1.8 need to be already installed in the machine
Note:  execution of Admin console scripts , i.e  create_user.py script should provide the username and password in sendkeys.

Steps to execute the test script

	1.Open the Terminal (Ctrl+Alt+t) in the ubuntu
	2.sudo apt update
	3.sudo apt install python3-pip
	4.Execute the Requirement.txt in the terminal (Requirement.txt file present in the cQubeTesting Folder) [mandatory]
	    pip3 install -r Requirement.txt 
	5.Fill the config.ini file (config.ini file present in the cQubeTesting Folder).

	  [config]
	  domain= #Enter the url of the cqube application ex: https://<domainname>/ or http://<ip>:4200
	  username= #Enter the username of report viewer  
	  password= #Enter the password of report viewer
	  admin_username = #Enter the admin user name 
	  admin_password = #Enter the admin password
	  
Note: Before running pytest ,please start the selenium grid by using command: java -jar selenium-server-standalone-3.14.jar  

	For Execution of Diksha Reports fallow the commands 
		pytest -s -v Diksha_reports/Testsuit/Diksha_suit.py

For Executing the Regression Test suites using pytest 
	pytest -n 20 --html = Regression.html --self-contained-html pytest_regression_testing/student_attendance_regression_testing.py
	pytest -n 25 --html = Regression.html --self-contained-html pytest_regression_testing/crc_report_regression_testing.py  
	pytest -n 20 --html = Regression.html --self-contained-html pytest_regression_testing/semester_report_regression_testing.py
	pytest -n 30 --html = Regression.html --self-contained-html pytest_regression_testing/School_Map_regression_testing.py
	pytest -n 22 --html = Regression.html --self-contained-html pytest_regression_testing/School_report_regression_testing.py
	pytest -n 20 --html = Regression.html --self-contained-html pytest_regression_testing/diksha_table_regression_testing.py
	pytest -n 15 --html = Regression.html --self-contained-html pytest_regression_testing/diksha_chart_Regression_testing.py
	pytest -n 20 --html = Regression.html --self-contained-html pytest_regression_testing/telemetry_regression_testing.py
	pytest -n 20 --html = Regression.html --self-contained-html pytest_regression_testing/exception_regression_testing.py

	For Execution of Admin console please fallow the commands 
		python3 -m unittest Testsuites/Unittest_regression_suite/Admin_console.py

	For Executing the Smoke Test suites
		pytest -s -v --html=smoke_test.html --html-contained-html TestSuites/SmokeTestSuite/Smoke_Testing.py
	  
	Please follow the steps for run testscripts for admin console
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
		

		
	Note: Each Single scripts takes more than 1 hour, you can execute the multiple test scripts by opening the terminal and navigating to the cQubeTesting folder and running the above testing suite.





















