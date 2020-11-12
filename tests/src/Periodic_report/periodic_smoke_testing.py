import time
import unittest

from Periodic_report.Click_on_hyper_link_in_periodic_report import Hyperlink
from Periodic_report.check_blocklevel_download_csv import Block_level_records
from Periodic_report.check_clusterlevel_download_csv import ClusterwiseCsv
from Periodic_report.check_districtlevel_download_csv import DistrictwiseCsv
from Periodic_report.check_dots_on_each_districts import DotsOnDistricts
from Periodic_report.check_periodic_choose_district_block_cluster import DistrictBlockCluster
from Periodic_report.check_schoollevel_download_csv import SchoolwiseCsv
from Periodic_report.check_total_no_students_and_total_no_schools_sr import TotalStudentsSchools
from Periodic_report.check_with_grade_dropdown import periodic_grades
from Periodic_report.click_on_Home_icon import Home
from Periodic_report.click_on_periodic_report import Pat_Report_icon
from Periodic_report.click_on_periodic_report_and_logout import Logout
from reuse_func import GetData


class periodic_smoke(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(50)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_periodic_report()
        self.data.page_loading(self.driver)

    def test_homebtn(self):
        b = Home(self.driver)
        time.sleep(3)
        res = b.click_HomeButton()
        self.assertEqual(0, res, msg='home button is not worked ')
        print('Home button is working ')
        self.data.navigate_to_periodic_report()
        self.data.page_loading(self.driver)

    def test_Pat_Report_icon(self):
        cls = Pat_Report_icon(self.driver)
        fnc = cls.check_landing_page()
        self.assertEqual(0, fnc, msg='Pat icon is not working ')
        print('Checked with pat icon is working fine ')
        self.data.page_loading(self.driver)

    def test_grades_selection(self):
        b = periodic_grades(self.driver)
        res = b.click_each_grades()
        print("selected each grade options ")
        time.sleep(5)
        self.data.page_loading(self.driver)

    def test_select_each_subjects(self):
        b = periodic_grades(self.driver)
        res = b.select_subjects_dropdown()
        print("selected each grade with all the subjects")
        self.data.page_loading(self.driver)

    def test_DistrictwiseCsv(self):
        cls = DistrictwiseCsv(self.driver)
        func = cls.click_download_icon()
        self.assertEqual(0, func, msg='Mismatch found at Districtwise footer values')
        print('Downloading district level csv file is working')
        self.data.page_loading(self.driver)

    def test_blockbutton_records(self):
        b = Block_level_records(self.driver)
        res1 = b.click_download_icon_of_blocks()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        print('Block level records are working fine')
        self.data.page_loading(self.driver)

    def test_clusterbutton_records(self):
        b = ClusterwiseCsv(self.driver)
        res1 = b.click_download_icon_of_clusters()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        print('cluster level records are working fine')
        self.data.page_loading(self.driver)

    # def test_DotsOnDistricts(self):
    #     b = DotsOnDistricts(self.driver)
    #     res = b.check_dots_on_each_districts()
    #     self.assertEqual(0, res, msg='Some districts dont have markers ')
    #     print('Checked with markers on each district wise')
    #     self.data.page_loading(self.driver)

    def test_schoolbutton_records(self):
        b = SchoolwiseCsv(self.driver)
        res1 = b.click_download_icon_of_schools()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        print('School level records are working fine')
        self.data.page_loading(self.driver)

    def test_district_block_clusterwise(self):
        b = DistrictBlockCluster(self.driver)
        res = b.check_district_block_cluster()
        self.assertEqual(0, res, msg='Some mis match found at school level records')
        print('School level records are working fine')
        self.data.page_loading(self.driver)

    def test_TotalStudentsSchools(self):
        b = TotalStudentsSchools(self.driver)
        res1, res2, res3, res4, res5, res6, res7, res8 = b.block_cluster_schools_footer_info()
        self.assertEqual(int(res1), int(res3), msg='Block level student info is mis matched')
        self.assertEqual(int(res2), int(res4), msg='Block level school info is mis matched')
        self.assertEqual(int(res1), int(res5), msg='Cluster level student info is mis matched')
        self.assertEqual(int(res2), int(res6), msg='Cluster level school info is mis matched')
        self.assertEqual(int(res1), int(res7), msg='School level student info is mis matched')
        self.assertEqual(int(res2), int(res8), msg='School level school info is mis matched')
        print('Checked with footer values accross block ,cluster , school levels ')
        self.data.page_loading(self.driver)

    def test_Homeicon(self):
        b = Home(self.driver)
        res = b.click_on_blocks_click_on_home_icon()
        print('Home icon is working')
        self.data.page_loading(self.driver)



    def test_check_hyperlinks(self):
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")
        self.data.page_loading(self.driver)

    def test_Logout(self):
        b = Logout(self.driver)
        res = b.click_on_logout()
        self.assertEqual('Log in to cQube', res, msg='Logout button is not working')
        self.data.page_loading(self.driver)
        print('Logout button is button and navigated to login page ')
        self.data.login_cqube(self.driver)
        self.data.navigate_to_periodic_report()
        self.data.page_loading(self.driver)




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()