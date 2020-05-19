Documentation of Automation testing....


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

If you want to run all tests, you should type:
python reportsall.py / python reports.py

If you want to run just a class, you should type:
python -m unittest classname.py<Testscripts/..> 

If you want to run just a test method, you should type:
python -m unittest filename.method_name
