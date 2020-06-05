# cQube-New

Documentation of Automation Testing

Selenium Testscripts with python 

Page-object-model (POM) is a pattern that you can apply it to develop efficient automation framework. With page-model, it is possible to minimise maintenance cost. Basically page-object means that your every page is inherited from a base class which includes basic functionalities for every pages. If you have some new functionality that every pages have, you can simple add it to the base class. along with we used other automation frameworks 

Data/Paramater.py is contains all the xpaths of web elements and credentials which are encrypted 
TestngReports  folder contains testNG report code which is implemented and executed all scripts 
Testscripts folder  contains all the selenium scripts fallowing their functionalities like
        1.Function testsscripts
        2.Integration testscripts 
        3.System or end to end testscripts
        4.Regression testscripts
        5.Sanity testscripts 
Those all testscripts to be done in cQube selenium project , it is not complted but still development of application is under process , we are handling testing parallaly and this all upto done with automation 

In framework  ,fallow some modification needed to run testscripts
1. path is varible that can hold location of chrome.exe or firefox.exe it's for opening browser and execution
2. Reports contains reports.html file we want to see test execution report means just click on file and open with any browser
   then only it shows result
3. TestReports file contains testng report code 

We fallowing converting Automation testcases into testscrits to be modified .
Note: we can run our testscripts in pycharm , intellij or terminal also 

If you want to run all tests, you should type:
python reportsall.py / python reports.py

If you want to run just a class, you should type:
python -m unittest classname.py<Testscripts/..> 

If you want to run just a test method, you should type:
python -m unittest filename.method_name

In TS directory contains resues_function.py class contains several methods which defines different functionalities in scripts
1.def open_cqube_appln(self: this method contains navigate to cQube application login page
2.def login_cqube(self):this method provides login through application 
3.def navigate_to_student_report(self): scripts navigated to Student Attedance report of august month
4.def navigate_to_student_report_S(self):scripts navigated to Student Attedance report of September month
5.def navigate_to_student_report_O(self):scripts navigated to Student Attedance report of October month
6.def navigate_to_semester_report(self): Scripts  navigated to Semester Assessment Reprot 
7.def navigate_to_crc_report(self): Scripts navigated to CRC report page
8.def Details_text(self): this displays school records present in bar below map
9.def ClickOn_HomeButton(self): method to click home_icon button
10.def CRC_footers(self):method to display visited or not visited information to be fetch
11.def test_Distnames(self): fetches district wise names 
12.def dots_dist(self): method to validate District name along no of dots on map 
13.def X_Yaxis(self): performs drop down functionality 
14.def crcDist_click(self): performs each district click and validate table data
These methods which implemeted in one class and calling it is object to particular scripts 

here We are use TestNG framework to generate the testcase report 
