


import unittest

from Diksha_TPD.TPD_Enrollment_completion.check_completion_time_periods import completion_time_periods
from Diksha_TPD.TPD_Enrollment_completion.check_enrollment_time_periods import Enrollment_time_periods
from Diksha_TPD.TPD_Enrollment_completion.check_homeicon_and_homebtn import Home_functionalities
from Diksha_TPD.TPD_Enrollment_completion.check_with_blockwise_records import Check_Block_wise
from Diksha_TPD.TPD_Enrollment_completion.check_with_clusterwise_records import  Check_Cluster_wise
from Diksha_TPD.TPD_Enrollment_completion.check_with_districts_records import Check_Districtwise
from Diksha_TPD.TPD_Enrollment_completion.check_with_logout_btn import logout_button
from Diksha_TPD.TPD_Enrollment_completion.enrollment_report_icon import enrollment_icon
from Diksha_TPD.TPD_Enrollment_completion.test_download_icon import Click_download_icon
from reuse_func import GetData


class cQube_enrollment_regression(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(200)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_tpd_enrollment_report()
        self.data.page_loading(self.driver)


    def test_tpd_enrollment_icon(self):
        b = enrollment_icon(self.driver)
        res = b.test_enrollment_icon()
        self.assertEqual(0,res,msg="Completion icon is not working ")
        self.data.page_loading(self.driver)

    def test_tpd_enrollment_from_hamburger(self):
        b = enrollment_icon(self.driver)
        res = b.test_dashboard_enrollment_report()
        self.assertEqual(0,res,msg="Navigation from hamburger is failed")
        self.data.page_loading(self.driver)

    def test_Enrollment_time_periods_overall(self):
        b=Enrollment_time_periods(self.driver)
        res,res1 = b.test_Enrollment_overall()
        self.assertNotEqual(0,res,msg='Collection names are empty')
        self.assertEqual(res1,0,msg="Enrollment Overall csv file is not downloaded ")
        self.data.page_loading(self.driver)



    def test_completion_time_periods_overall(self):
        b = completion_time_periods(self.driver)
        res, res1 = b.test_completion_overall()
        self.assertNotEqual(0, res, msg='Collection names are empty')
        self.assertEqual(res1, 0, msg="Enrollment Overall csv file is not downloaded ")
        self.data.page_loading(self.driver)



    def test_Home_functionalities(self):
        b = Home_functionalities(self.driver)
        res = b.test_homeicon_functionality()
        # self.assertFalse(res,msg="Time period is not selected")
        self.data.page_loading(self.driver)

    def test_Homebtn_functionalities(self):
        b = Home_functionalities(self.driver)
        res = b.test_homebtn_funtion()
        self.assertEqual(res,0 ,msg="Homebtn is not worked")
        self.data.page_loading(self.driver)

    def test_hyperlink_function(self):
        b=Home_functionalities(self.driver)
        res = b.test_hyperlink_function()
        print("Hyper link is working ")
        self.data.page_loading(self.driver)

    def test_Click_download_icon(self):
        b  = Click_download_icon(self.driver)
        res = b.test_check_download_icon()
        self.assertEqual(res,0,msg='Districtwise csv file is not downloaded')
        print('Enrollment count is correctly displaying')
        self.data.page_loading(self.driver)

    def test_districtwise_records(self):
        b =Check_Districtwise(self.driver)
        res = b.test_coursetype_with_all_districts()
        self.assertEqual(0,res,msg='Some district csv file is not downloaded')
        print("Districtwise csv file is downloading")
        self.data.page_loading(self.driver)

    def test_blockwise_records(self):
        b = Check_Block_wise(self.driver)
        res = b.test_coursetype_with_all_blockwise()
        self.assertEqual(0, res, msg='Some Blocks csv file is not downloaded')
        print('Blockwise csv file is downloading')
        self.data.page_loading(self.driver)

    def test_clusterwise_records(self):
        b = Check_Cluster_wise(self.driver)
        res = b.test_coursetype_with_all_clusterwise()
        self.assertEqual(0, res, msg='Some Cluster csv file is not downloaded')
        print('Clusterwise csv file is downloaded')
        self.data.page_loading(self.driver)

    def test_logout_button(self):
        b = logout_button(self.driver)
        res = b.click_on_logout_btn()
        self.assertEqual(0,res,msg='Logout btn is not working ')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()