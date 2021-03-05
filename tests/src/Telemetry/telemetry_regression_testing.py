import os
import time
import unittest
from Data.parameters import Data
from Telemetry.check_with_lastday import lastday_timeperiod
from Telemetry.check_with_lastmonth import lastmonth_timeperiod
from Telemetry.check_with_lastweek import last7day_timeperiod
from Telemetry.check_with_overall import overall_timeperiod
from Telemetry.download_last7day_records import last7day_download

from Telemetry.download_lastday_records import lastday_download
from Telemetry.download_overall_records import overall_download
from Telemetry.download_the_lastmonth_recor import lastmonth_download
from filenames import file_extention

from get_dir import pwd
from reuse_func import GetData


class Test_Telemetry(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_cqube(self.driver)
        time.sleep(2)
        self.data.navigate_to_telemetry()
        time.sleep(3)

    def test_navigate_by_dashboard(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        if '' in self.driver.current_url:
            print("Telemetry page is present ")
        else:
            print("Telemetry page is not present ")
            count = count + 1
        self.assertEqual(0,count,msg='Telemetry page is not displayed')
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_click_on_blocks_cluster_school(self):
        self.data.page_loading(self.driver)
        p = pwd()
        count =0
        files = file_extention()
        self.driver.find_element_by_id(Data.block_btn).click()
        self.data.page_loading(self.driver)
        time.sleep(5)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        markers = len(dots) - 1
        self.assertNotEqual(0, markers  , msg="Markers not present on block level ")
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() +'/'+ files.telemtry_block()+self.data.get_current_date()+'.csv'
        print(self.filename)
        if os.path.isfile(self.filename) != True:
            print('Block wise csv file is not download')
            count = count + 1
        else:
            print( files.telemtry_block()+'is downloaded')
            os.remove(self.filename)
        # self.driver.find_element_by_id('homeBtn').click()
        # self.data.page_loading(self.driver)
        # self.driver.find_element_by_id('telemData').click()
        # self.data.page_loading(self.driver)


        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cluster_btn).click()
        self.data.page_loading(self.driver)
        time.sleep(5)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        markers = len(dots) - 1
        self.assertNotEqual(0, markers, msg="Markers not present on cluster level ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() + '/' + files.telemetry_cluster() + self.data.get_current_date() + '.csv'
        if os.path.isfile(self.filename) != True:
            print('Cluster wise csv file is not download')
            count = count + 1
        else:
            print(files.telemetry_cluster()+'is downloaded csv file')
            os.remove(self.filename)
        # self.driver.find_element_by_id('homeBtn').click()
        # self.data.page_loading(self.driver)
        # self.driver.find_element_by_id('telemData').click()
        # self.data.page_loading(self.driver)



        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.schoolbtn).click()
        self.data.page_loading(self.driver)
        time.sleep(5)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        markers = len(dots) - 1
        self.assertNotEqual(0, markers, msg="Markers not present on cluster level ")
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() + '/' + files.telemetry_school() + self.data.get_current_date() + '.csv'
        if os.path.isfile(self.filename) != True:
            print('School wise csv file is not download')
            count = count + 1
        else:
            print(files.telemetry_school()+'is downloaded csv file')
            os.remove(self.filename)
        self.assertEqual(0,count,msg='File is not downloaded')
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)




    def test_check_with_lastday(self):
        b = lastday_timeperiod(self.driver)
        res1, res2, res3 = b.test_lastday_records()
        self.assertNotEqual(0, res1, msg='Block level markers are not present')
        self.assertNotEqual(0, res2, msg='Cluster level markers are not present')
        self.assertNotEqual(0, res3, msg='School level markers are not present')
        print('Last 7 days checked for block , cluster and school levels ')
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_last7day_timeperiod(self):
        b = last7day_timeperiod(self.driver)
        res1, res2, res3 = b.test_last7day_records()
        self.assertNotEqual(0, res1, msg='Block level markers are not present')
        self.assertNotEqual(0, res2, msg='Cluster level markers are not present')
        self.assertNotEqual(0, res3, msg='School level markers are not present')
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_lastmonth_timeperiod(self):
        b = lastmonth_timeperiod(self.driver)
        res1, res2, res3 = b.test_lastmonth_records()
        self.assertNotEqual(0, res1, msg='Block level markers are not present')
        self.assertNotEqual(0, res2, msg='Cluster level markers are not present')
        self.assertNotEqual(0, res3, msg='School level markers are not present')
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_overall_period(self):
        b = overall_timeperiod(self.driver)
        res1, res2, res3 = b.test_overall_records()
        self.assertNotEqual(0, res1, msg='Block level markers are not present')
        self.assertNotEqual(0, res2, msg='Cluster level markers are not present')
        self.assertNotEqual(0, res3, msg='School level markers are not present')
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_last7day_download(self):
        b = last7day_download(self.driver)
        res = b.test_last_7_records()
        self.assertTrue(res, msg="last 7day's csv file is not downloaded")
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_lastday_download(self):
        b = lastday_download(self.driver)
        res = b.test_lastday_records()
        self.assertTrue(res, msg="last7day's csv file is not downloaded")
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_overall_download(self):
        b = overall_download(self.driver)
        res = b.test_overall_records()
        self.assertTrue(res, msg="last7day's csv file is not downloaded")
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)

    def test_lastmonth_download(self):
        b = lastmonth_download(self.driver)
        res = b.test_lastmonth_records()
        self.assertTrue(res, msg="last7day's csv file is not downloaded")
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)


    def test_homeicon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.block_btn).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cluster_btn).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.schoolbtn).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('telemData').click()
        self.data.page_loading(self.driver)


    def test_clickon_homebtn(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        # self.driver.find_element_by_id('telemData').click()
        self.data.navigate_to_telemetry()
        if 'telemetry' in self.driver.current_url:
            print("Telemetry page is present ")
        else:
            print("Telemetry page is not present ")
            count = count + 1
        self.assertEqual(0, count, msg='Telemetry page is not displayed')
        self.data.page_loading(self.driver)
        # self.driver.find_element_by_id('homeBtn').click()
        # self.data.page_loading(self.driver)
        # self.driver.find_element_by_id('telemData').click()
        # self.data.page_loading(self.driver)



    def test_logout(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        time.sleep(5)
        self.assertEqual('Log in to cQube',self.driver.title,msg="logout is not working ")
        self.data.login_cqube(self.driver)
        time.sleep(2)
        # self.driver.find_element_by_id('telemData').click()
        self.data.navigate_to_telemetry()
        time.sleep(5)
        count = 0
        if 'telemetry' in self.driver.current_url:
            print("Telemetry page is displayed")
        else:
            print('Failed to navigate to telemetry report page ')
            count = count + 1
        self.assertEqual(0,count,msg='Navigation is failed ')
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()