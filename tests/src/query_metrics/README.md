# CqubeMetric is a project which is used to calculate the metrics, by using the queries and json files which is storedin the s3 output bucket
This project will execute the test scripts and provide the report based on studendance attendance report,crc,semester
To run this project json_data should be downloaded from s3 output bucket and store it in you local machine.

Fill the Details in crc_ini
[url]
domain=<hostname for connecting to the api>
email=<username for login to api>
password=<password for login to api>

Fill the Details in Database.ini

[pgsql]
host=<hostname for connecting to postgres>
port=5432
database=<db name>
user=<username for connecting to the db>
password=<password for connecting to the db>

Fill the Details in  json_data.ini

[jsondata]
district_attendance_2019_8=     #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/district_attendance_2019_8.json)
district_attendance_2019_9=     #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/district_attendance_2019_9.json)
district_attendance_2019_10=    #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/district_attendance_2019_10.json)

block_attendance_2019_8=        #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/block_attendance_2019_8.json)
block_attendance_2019_9=        #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/block_attendance_2019_9.json)
block_attendance_2019_10=       #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/block_attendance_2019_10.json)

cluster_attendance_2019_8=      #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/cluster_attendance_2019_8.json)
cluster_attendance_2019_9=      #(ex : /home/ubuntu/PycharmProjects/CqubeMetric/json_data/cluster_attendance_2019_9.json)
cluster_attendance_2019_10=     #(ex :/home/ubuntu/PycharmProjects/CqubeMetric/json_data/cluster_attendance_2019_10.json)

school_attendance_2019_8=       #(ex: /home/ubuntu/PycharmProjects/CqubeMetric/json_data/school_attendance_2019_8.json)
school_attendance_2019_9=       #(ex: /home/ubuntu/PycharmProjects/CqubeMetric/json_data/school_attendance_2019_9.json)
school_attendance_2019_10=      #(ex: /home/ubuntu/PycharmProjects/CqubeMetric/json_data/school_attendance_2019_10.json)

district_semester=              #ex: /home/ubuntu/PycharmProjects/CqubeMetric/json_data/district_assesment_2.json
block_semester=                 #(ex: /home/ubuntu/PycharmProjects/CqubeMetric/json_data/block_assesment_2.json
cluster_semester=               #(ex:/home/ubuntu/PycharmProjects/CqubeMetric/json_data/cluster_assesment_2.json
school_semester=                #(ex:/home/ubuntu/PycharmProjects/CqubeMetric/json_data/school_assesment_2.json

Run the test script by using the run_tests.py which in the CqubeMetric -> RunTestScripts -> run.tests.py

Recommended Environment for running the test scripts are ubuntu 16.0.LTS above and open the Project in the Pycharm IDE.

