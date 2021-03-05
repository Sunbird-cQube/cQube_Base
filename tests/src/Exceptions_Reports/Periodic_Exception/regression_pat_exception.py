# -*- coding: utf-8 -*-
import unittest
import time

from Data.parameters import Data
from Exceptions_Reports.Periodic_Exception.pat_scripts import pat_exception_report
from reuse_func import GetData


class cQube_pat_exception_regression_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(100)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_pat_exception()
            self.data.page_loading(self.driver)

    def test_DistrictwiseDownload(self):
        b = pat_exception_report(self.driver)
        res = b.check_districts_csv_download()
        self.assertEqual(0, res, msg="Some district level csv file is not downloaded")
        print('Checking each districtwise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_ClusterPerBlockCsvDownload(self):
        b = pat_exception_report(self.driver)
        res = b.ClusterPerBlockCsvDownload()
        self.assertEqual(0,res , msg='Some cluster level files are not downloaded')
        print('Checking each cluster markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_SchoolPerClusterCsvDownload(self):
        b = pat_exception_report(self.driver)
        res = b.SchoolPerClusterCsvDownload()
        self.assertEqual(0, res, msg='Some School level files are not downloaded')
        print('Checking each school wise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_DotsOnDistrictwise_map(self):
        b = pat_exception_report(self.driver)
        res = b.check_dots_on_each_districts()
        self.assertEqual(0,res,msg='Markers are not present on districtwise map ')
        print('Checking each districtwise markers')
        self.data.page_loading(self.driver)

    # def test_Data_not_recieved(self):
    #     b = pat_exception_report(self.driver)
    #     res,r1,r2,r3 = b.test_total_not_recieved_data()
    #     self.assertEqual(res,r1,msg='Block level data not recieved count mismatch found')
    #     self.assertEqual(res,r2,msg='cluster level data not recieved count mismatch found')
    #     self.assertEqual(res,r3,msg='School level data not recieved count mismatch found')

    def test_pat_exception_Blocks(self):
        b = pat_exception_report(self.driver)
        res = b.check_markers_on_block_map()
        self.assertNotEqual(0,res,msg="markers are not present on block level map")
        print('Checked blockwise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    def test_pat_clusters(self):
        b = pat_exception_report(self.driver)
        res = b.check_markers_on_clusters_map()
        self.assertNotEqual(0,res,msg="markers are not present on cluster level map")
        print('Checked cluster wise markers and csv file downloading ')
        self.data.page_loading(self.driver)

    # def test_pat_school(self):
    #     b = pat_exception_report(self.driver)
    #     res = b.check_markers_on_school_map()
    #     self.assertNotEqual(0,res,msg="markers are not present on cluster level map")
    #     print('Checked schoolwise markers and csv file downloading ')
    #     self.data.page_loading(self.driver)


    def test_pat_exception_Logout(self):
        b = pat_exception_report(self.driver)
        res = b.click_on_logout()
        self.assertEqual(res,'Log in to cQube',msg="logout button is not working")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_pat_exception()
        print("Logout button is working fine ")
        self.data.page_loading(self.driver)

    def test_timeseries_overall(self):
        b = pat_exception_report(self.driver)
        res = b.check_time_series_overall()
        self.assertEqual(0,res,msg='Overall csv file is not downloaded')
        print("Checked with over all time series")
        self.data.page_loading(self.driver)

    def test_timeseries_last7days(self):
        b = pat_exception_report(self.driver)
        res = b.check_time_series_last_7_days()
        self.assertEqual(0,res,msg='last 7 days csv file is not downloaded')
        print("Checked with last 7 days time series")
        self.data.page_loading(self.driver)

    def test_timeseries_last30days(self):
        b = pat_exception_report(self.driver)
        res = b.check_time_series_last_30_days()
        self.assertEqual(0, res, msg='last 30 days csv file is not downloaded')
        print("Checked with last 30 days time series")
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()