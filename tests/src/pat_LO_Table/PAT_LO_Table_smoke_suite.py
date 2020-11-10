
import unittest
from pat_LO_Table.Check_random_selection_on_each_dropdown import Random_test
from pat_LO_Table.check_catogory_levels import Catagory_series
from pat_LO_Table.check_clusters_dropdown import Clusterswise
from pat_LO_Table.check_district_dropdown import districtwise
from pat_LO_Table.check_download_function import Download_districtwise
from pat_LO_Table.check_exam_dates import exams_series
from pat_LO_Table.check_gradewise_records import gradewise_records
from pat_LO_Table.check_subject_dropdown import subject_levels
from pat_LO_Table.check_with_homeicons_and_homebutton import Home_functions
from pat_LO_Table.check_with_logout_btn import logout
from pat_LO_Table.check_year_dropdown import year_selection
from reuse_func import GetData


class cQube_pat_lotable_smoke_test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_lo_table_report()


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
        self.data.navigate_to_heatchart_report()
        self.data.page_loading(self.driver)

    def test_year_selection(self):
        b = year_selection(self.driver)
        res = b.test_year_dropdown()
        self.assertEqual(0,res,msg='Year is not selected ')
        self.data.page_loading(self.driver)


    def test_districtwise(self):
        b = districtwise(self.driver)
        res = b.District_select_box()
        self.assertEqual(0,res,msg='Some districtwise csv file is not downloaded')
        self.data.page_loading(self.driver)


    def test_clusterwise(self):
        b = Clusterswise(self.driver)
        res = b.Clusters_select_box()
        self.assertEqual(0,res,msg='Some cluster wise csv file is not downloaded ')
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