import time
import unittest

from Data.parameters import Data
from Periodic_Test_Reports.pat_LO_Table import Random_test
from Periodic_Test_Reports.pat_LO_Table import blocks
from Periodic_Test_Reports.pat_LO_Table import Catagory_series
from Periodic_Test_Reports.pat_LO_Table import Clusterswise
from Periodic_Test_Reports.pat_LO_Table.check_district_dropdown import districtwise
from Periodic_Test_Reports.pat_LO_Table.check_download_function import Download_districtwise
from Periodic_Test_Reports.pat_LO_Table.check_exam_dates import exams_series
from Periodic_Test_Reports.pat_LO_Table.check_gradewise_records import gradewise_records
from Periodic_Test_Reports.pat_LO_Table.check_subject_dropdown import subject_levels
from Periodic_Test_Reports.pat_LO_Table import Home_functions
from Periodic_Test_Reports.pat_LO_Table.check_with_logout_btn import logout
from Periodic_Test_Reports.pat_LO_Table.check_year_dropdown import year_selection
from Periodic_Test_Reports.pat_LO_Table import check_order_of_tabledata
from reuse_func import GetData


class cQube_LOTable_fuuctionalTest(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(200)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_lo_table_report()

    def test_heatchart_icon(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_xpath("//div[@id='lotable']").click()
        if "PAT-LO-table" in self.driver.current_url:
            print('PAT LO TABLE icon is working ')
        else:
            print('PAT LO TABLE  icon is not working')
            count = count + 1
        self.assertEqual(count,0,msg='hear chart icon is not working')
        self.data.page_loading(self.driver)

    def test_hamburger_chart(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.navigate_to_lo_table_report()
        self.data.page_loading(self.driver)
        if 'PAT-LO-table' in self.driver.current_url:
            print('PAT-LO Table report is displayed')
        else:
            print("Navigation is failed from hamburger")
            count = count + 1
        self.assertEqual(count,0,msg="hamburger to report is failed")
        self.data.page_loading(self.driver)

    def test_Catagory_series(self):
        b =Catagory_series(self.driver)
        res = b.viewbys_options()
        self.assertEqual(0,res,msg='View by csv file is not downloaded')
        self.data.page_loading(self.driver)

    def test_Download_districtwise(self):
        b =Download_districtwise(self.driver)
        res = b.download_all_district_records()
        self.assertEqual(res,0,msg="Districtwise csv file is not downloaded")
        self.data.page_loading(self.driver)

    def test_check_orderwise(self):
        self.data.page_loading(self.driver)
        b = check_order_of_tabledata(self.driver)
        print("Table record order wise..")
        res = b.test_tablevalue()
        print("checked with orderwise of table data")
        self.data.page_loading(self.driver)
        time.sleep(5)

    def test_exams_series(self):
        b = exams_series(self.driver)
        res = b.exams_dates()
        self.assertEqual(res,0,msg="exam date is not displayed on chart")
        self.data.page_loading(self.driver)

    def test_subject_levels(self):
        b =subject_levels(self.driver)
        res = b.subjects_types()
        self.assertEqual(res,0,msg="Subject's csv file is not downloaded")
        self.data.page_loading(self.driver)

    def test_Home_functions(self):
        b = Home_functions(self.driver)
        res = b.test_homeicons()
        self.data.page_loading(self.driver)

    def test_Homebtn_functions(self):
        b = Home_functions(self.driver)
        res = b.test_homebutton()
        self.assertEqual(res,0,msg='Homebtn is not working')
        self.data.page_loading(self.driver)

    def test_logout_function(self):
        b = logout(self.driver)
        res = b.test_logoutbtn()
        self.assertEqual(0,res,msg="Logout button is not working ")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_lo_table_report()
        self.data.page_loading(self.driver)

    def test_year_selection(self):
        b = year_selection(self.driver)
        res = b.test_year_dropdown()
        self.assertEqual(0,res,msg='Year is not selected ')
        self.data.page_loading(self.driver)

    # def test_check_hyperlinks(self):
    #     hyperlinks = heatchart_hyperlink(self.driver)
    #     res = hyperlinks.test_hypers()
    #     print('hyper link is working ')
    #     self.data.page_loading(self.driver)

    def test_districtwise(self):
        b = districtwise(self.driver)
        res = b.District_select_box()
        self.assertEqual(0,res,msg='Some districtwise csv file is not downloaded')
        print("Checked with districtwise table records")
        self.data.page_loading(self.driver)

    def test_blockwise(self):
        b = blocks(self.driver)
        res = b.Blocks_select_box()
        self.assertEqual(0,res,msg='Some block wise csv file is not downloaded ')
        self.data.page_loading(self.driver)

    def test_clusterwise(self):
        b = Clusterswise(self.driver)
        res = b.Clusters_select_box()
        self.assertEqual(0,res,msg='Some cluster wise csv file is not downloaded ')
        self.data.page_loading(self.driver)


    def test_test_questions(self):
        b = Catagory_series(self.driver)
        res = b.test_questions_records()
        self.assertEqual(res,0,msg='Selected view by records are not displayed')
        self.data.page_loading(self.driver)

    def test_test_indicators(self):
        self.data.page_loading(self.driver)
        b = Catagory_series(self.driver)
        res = b.test_indicator_records()
        self.assertEqual(res, 0, msg='Selected view by records are not displayed')
        self.data.page_loading(self.driver)

    def test_gradewise_records(self):
        b =gradewise_records(self.driver)
        res = b.grades_files()
        self.assertEqual(0,res,msg='Some grade files are not downloaded')
        self.data.page_loading(self.driver)

    def test_Random_test(self):
        b = Random_test(self.driver)
        res = b.test_randoms()
        self.assertEqual(0, res, msg='Random selection is failed ')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()