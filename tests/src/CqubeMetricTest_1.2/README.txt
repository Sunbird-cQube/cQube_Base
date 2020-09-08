CqubeMetricTest is used to calculate the metrics of semester exception report, diksha stacked chart report, diksha column chart report and diksha table report.
Metrics test done by using the sql queries and json files(s3 output bucket json files).

Fill the Details in Database.ini

[pgsql] 
host= # hostname for connecting to postgres (ex :locahost or public ip) 
port=5432 # Port number for postgres (default port number is 5432)
database= # Enter the Database name for postgres which is provided in the config.yml while installing 
user= # Enter the username name for postgres which is provided in the config.yml while installing 
password= # Enter the password for postgres which is provided in the config.yml while installing.

Fill the Details in json_data.ini

Download the output_data folder from the s3 output bucket and store it in the home directory(ie /home/ubuntu/output_data).

Steps to execute the test script

	1.Open the Terminal (Ctrl+Alt+t) in the ubuntu
	2.sudo apt update
	3.sudo apt install python3-pip
	4.Execute the Requirement.txt in the terminal (Requirement.txt file present in the CqubeMetricTest Folder) [mandatory]
	    pip3 install -r Requirement.txt 
	5.Run the test script by using the run_tests.py ( Location of the file CqubeMetricTest -> RunTestScripts -> run.tests.py )
        
Note : 
The system username must be ubuntu and the output_data folder must be placed in the home directory only.
Recommended Environment for running the test scripts are ubuntu 18.0.4.LTS or above and open the Project in the Pycharm IDE.
