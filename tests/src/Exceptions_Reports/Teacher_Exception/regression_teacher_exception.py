# -*- coding: utf-8 -*-
import unittest
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from Exceptions_Reports.Teacher_Exception.teacher_exception_scripts import teacher_exception_report
from reuse_func import GetData


class cQube_teacher_exception_regression_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(100)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_teacher_exception()
            self.data.page_loading(self.driver)
            year = Select(self.driver.find_element_by_id(Data.sar_year))
            month = Select(self.driver.find_element_by_id(Data.sar_month))
            self.year = year.first_selected_option.text
            self.month = month.first_selected_option.text


    def test_DistrictwiseDownload(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1,res2 = b.check_districts_csv_download()
        self.assertNotEqual(res1,0,msg='Markers are not present')
        self.assertEqual(0, res2, msg="Some district level csv file is not downloaded")
        print('Checking each districtwise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_ClusterPerBlockCsvDownload(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1,res2 = b.ClusterPerBlockCsvDownload()
        self.assertNotEqual(res1,0,msg='Markers are not present')
        self.assertEqual(0,res2 , msg='Some cluster level files are not downloaded')
        print('Checking each cluster markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_SchoolPerClusterCsvDownload(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1,res2 = b.SchoolPerClusterCsvDownload()
        self.assertNotEqual(0,res1,msg='Markers are not present')
        self.assertEqual(0, res2, msg='Some School level files are not downloaded')
        print('Checking each school wise markers and csv file downloading ')
        self.data.page_loading(self.driver)



    def test_Data_not_recieved(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res,r1,r2,r3 = b.test_total_not_recieved_data()
        self.assertEqual(res,r1,msg='Block level data not recieved count mismatch found')
        self.assertEqual(res,r2,msg='cluster level data not recieved count mismatch found')
        self.assertEqual(res,r3,msg='School level data not recieved count mismatch found')

    def test_teacher_exception_Blocks(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1,res2 = b.check_markers_on_block_map()
        self.assertNotEqual(0,res1,msg="markers are not present on block level map")
        self.assertEqual(0,res2,msg='Footer mis match found at block level')
        print('Checked blockwise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_teacher_clusters(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1, res2 = b.check_markers_on_block_map()
        self.assertNotEqual(0, res1, msg="markers are not present on cluster level map")
        self.assertEqual(0, res2, msg='Footer mis match found at cluster level')
        print('Checked cluster wise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_teacher_school(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1, res2 = b.check_markers_on_block_map()
        self.assertNotEqual(0, res1, msg="markers are not present on school level map")
        self.assertEqual(0, res2, msg='Footer mis match found at school level')
        print('Checked schoolwise markers and csv file downloading ')
        self.data.page_loading(self.driver)


    def test_teacher_exception_icon(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res = b.test_icon()
        self.assertEqual(0,res,msg='teacher exception report is not displayed')
        print("Pat exception icon on landing is working ")

    def test_teacher_exception_Logout(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res = b.click_on_logout()
        self.assertEqual(res,'Log in to cQube',msg="logout button is not working")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_teacher_exception()
        print("Logout button is working fine ")
        self.data.page_loading(self.driver)

    def test_cluster_btn_records(self):
        b = teacher_exception_report(self.driver,self.year, self.month)
        res1,res2 = b.check_markers_on_clusters_map()
        self.assertNotEqual(0,res1,msg="Cluster level markers are not present")
        self.assertEqual(0,res2,msg='Cluster csv file is not downloaded')
        print('Checked with Clusterwise map records')
        self.data.page_loading(self.driver)

    def test_block_btn_records(self):
        b = teacher_exception_report(self.driver, self.year, self.month)
        res1, res2 = b.check_markers_on_block_map()
        self.assertNotEqual(0, res1, msg="Block level markers are not present")
        self.assertEqual(0, res2, msg='Blockwise csv file is not downloaded')
        print('Checked with blockwise map records')
        self.data.page_loading(self.driver)

    def test_school_btn_records(self):
        b = teacher_exception_report(self.driver, self.year, self.month)
        res1, res2 = b.check_markers_on_school_map()
        self.assertNotEqual(0, res1, msg="School level markers are not present")
        self.assertEqual(0, res2, msg='Schoolwise csv file is not downloaded')
        print('Checked with schoolwise map records')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()