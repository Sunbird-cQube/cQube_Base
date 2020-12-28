import unittest
from Data.parameters import Data

from Pat_Heatchart.Check_random_selection_on_each_dropdown import Random_test
from Pat_Heatchart.check_blocks_dropdown import blocks
from Pat_Heatchart.check_catogory_levels import Catagory_series
from Pat_Heatchart.check_clusters_dropdown import Clusterswise
from Pat_Heatchart.check_district_dropdown import districtwise
from Pat_Heatchart.check_download_function import Download_districtwise
from Pat_Heatchart.check_exam_dates import exams_series
from Pat_Heatchart.check_gradewise_records import gradewise_records
from Pat_Heatchart.check_subject_dropdown import subject_levels
from Pat_Heatchart.check_with_homeicons_and_homebutton import Home_functions
from Pat_Heatchart.check_with_hyperlink import heatchart_hyperlink
from Pat_Heatchart.check_with_logout_btn import logout
from Pat_Heatchart.check_year_dropdown import year_selection

from reuse_func import GetData


class cQube_heatchart_functionalTest(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_heatchart_report()

    def test_heatchart_icon(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_xpath("//div[@id='heatChart']").click()
        if "heat-chart" in self.driver.current_url:
            print('Heatchart icon is working ')
        else:
            print('Heat chart icon is not working')
            count = count + 1
        self.assertEqual(count,0,msg='heat chart icon is not working')
        self.data.page_loading(self.driver)

    def test_hamburger_chart(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.navigate_to_heatchart_report()
        self.data.page_loading(self.driver)
        if 'heat-chart' in self.driver.current_url:
            print('Heat chart report is displayed')
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
        print("Checked with homeicon functionality ")
        self.data.page_loading(self.driver)

    def test_Homebtn_functions(self):
        b = Home_functions(self.driver)
        res = b.test_homebutton()
        self.assertEqual(res,0,msg='Homebtn is not working')
        self.data.page_loading(self.driver)
    #
    def test_logout_function(self):
        b = logout(self.driver)
        res = b.test_logoutbtn()
        self.assertEqual(0,res,msg="Logout button is not working ")
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_heatchart_report()
        self.data.page_loading(self.driver)

    def test_year_selection(self):
        b = year_selection(self.driver)
        res = b.test_year_dropdown()
        self.assertEqual(0,res,msg='Year is not selected ')
        self.data.page_loading(self.driver)

    def test_check_hyperlinks(self):
        hyperlinks = heatchart_hyperlink(self.driver)
        res = hyperlinks.test_hypers()
        print('hyper link is working ')
        self.data.page_loading(self.driver)

    def test_districtwise(self):
        b = districtwise(self.driver)
        res = b.District_select_box()
        self.assertEqual(0,res,msg='Some districtwise csv file is not downloaded')
        self.data.page_loading(self.driver)

    def test_blockwise(self):
        b = blocks(self.driver)
        res = b.Blocks_select_box()
        self.assertEqual(0,res,msg='Some block wise csv file is not downloaded ')
        print('Checked with all block level records')
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
        self.assertEqual(0,res,msg='Random selection is failed ')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()