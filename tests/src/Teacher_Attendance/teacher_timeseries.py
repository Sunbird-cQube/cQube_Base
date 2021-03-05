import unittest

from Student_Attendance.sar_time_series import time_series
from Teacher_Attendance.click_on_Home_icon import Home
from reuse_func import GetData


class cQube_teacher_timeseries(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_teacher_attendance_report()
        self.data.page_loading(self.driver)

    # def test_time_series(self):
    #      p = time_series(self.driver)
    #      res = p.check_time_series_day()
    #      self.assertEqual(0,res,msg='Time series dropdown having no options ')
    #      print('checked with Time series drop down ')
    #      self.data.page_loading(self.driver)
    #
    # def  test_time_series_dropdown_options(self):
    #      p = time_series(self.driver)
    #      res = p.check_time_series_dropdown_options()
    #      self.assertNotEqual(0,res,msg='Time series dropdown having no options ')
    #      print('checked with Time series drop down ')
    #      self.data.page_loading(self.driver)
    #
    # def test_time_last_day_series(self):
    #      p = time_series(self.driver)
    #      res = p.check_time_series_month_and_year()
    #      self.assertEqual(0,res,msg='last day csv file is not downloaded')
    #      print('checked with Time series  last day')
    #      self.data.page_loading(self.driver)
    #
    # def test_time_day_series(self):
    #     p = time_series(self.driver)
    #     res = p.check_time_series_day()
    #     # self.assertEqual(0, res, msg='time series day csv file is not downloaded')
    #     print('checked with Time series  last day')
    #     self.data.page_loading(self.driver)
    #
    # def test_time_last_7day_series(self):
    #     p = time_series(self.driver)
    #     res = p.check_time_series_last_7_days()
    #     self.assertEqual(0, res, msg='last 7 days csv file is not downloaded')
    #     print('checked with Time series  last 7 day')
    #     self.data.page_loading(self.driver)
    #
    # def test_time_last_30_day_series(self):
    #     p = time_series(self.driver)
    #     res = p.check_time_series_last_30_days()
    #     self.assertEqual(0, res, msg='last 30 days csv file is not downloaded')
    #     print('checked with Time series  last 30 day')
    #     self.data.page_loading(self.driver)
    #
    # def test_timeseries_overall_series(self):
    #     p = time_series(self.driver)
    #     res = p.check_time_overall_series_dropdown()
    #     self.assertEqual(0, res, msg='overall csv file is not downloaded')
    #     print('checked with Time series overall')
    #     self.data.page_loading(self.driver)
    #
    # def test_month_and_year(self):
    #     p =  time_series(self.driver)
    #     res = p.check_time_series_month_and_year()
    #     self.assertEqual(0, res, msg='year and month csv file is not downloaded')
    #     print('checked with Time series year and month')
    #     self.data.page_loading(self.driver)
    #
    # def test_month_and_year_csv_file(self):
    #     p =  time_series(self.driver)
    #     res = p.check_year_and_month_dropdowns_csv_download()
    #     self.assertEqual(0, res, msg='year and month csv file is not downloaded')
    #     print('checked with Time series year and month')
    #     self.data.page_loading(self.driver)
    #
    # def test_time_series_and_click_on_block_cluster_school_btns(self):
    #     p = time_series(self.driver)
    #     res = p.check_select_time_series_and_click_on_block_cluster_school_btns()
    #     self.assertEqual(0, res, msg='Footer value mismatch found')
    #     print("Checking with block ,cluster and school level of time series")
    #     self.data.page_loading(self.driver)

    def test_academic_dropdown_box(self):
        p = Home(self.driver)
        res = p.check_academic_dropdown_is_present()
        self.assertNotEqual(0,res,msg="Options are not present in dropdown")
        print('checked with academic dropdown')
        self.data.page_loading(self.driver)

    def test_academic_dropdown_options(self):
        p = Home(self.driver)
        res = p.check_academic_dropdown_options()
        self.assertNotEqual(0, res, msg="Options are not present in dropdown")
        print('checked with academic years')
        self.data.page_loading(self.driver)

    def test_academic_year_csv_file_download(self):
        p = Home(self.driver)
        res = p.download_yearwise_files_by_academic_year()
        self.assertEqual(0, res, msg="Academic file is not downloaded")
        print('checked with academic years')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()