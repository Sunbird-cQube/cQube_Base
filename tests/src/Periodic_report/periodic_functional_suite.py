import time

from Data.parameters import Data

from Periodic_report.Click_on_hyper_link_in_periodic_report import Hyperlink
from Periodic_report.check_blocklevel_download_csv import Block_level_records
from Periodic_report.check_clusterlevel_download_csv import ClusterwiseCsv
from Periodic_report.check_clusterwise_downloadcsv import Districts_Block_downloadcsv
from Periodic_report.check_districtlevel_download_csv import DistrictwiseCsv

from Periodic_report.check_districtwise_downloadcsv import Districtwise_csv_download
from Periodic_report.check_dots_on_each_districts import DotsOnDistricts
from Periodic_report.check_periodic_choose_district import District
from Periodic_report.check_periodic_choose_district_block import DistrictsBlock
from Periodic_report.check_periodic_choose_district_block_cluster import DistrictBlockCluster

from Periodic_report.check_schoollevel_download_csv import SchoolwiseCsv
from Periodic_report.check_schoolwise_downloadcsv import DistrictBlockCluster_donwloadcsv
from Periodic_report.check_tooltips import mouseover_on_tooltip
from Periodic_report.check_total_no_students_and_total_no_schools_sr import TotalStudentsSchools
from Periodic_report.check_with_blocklevel_footer import Block_level_footers

from Periodic_report.check_with_clusterlevel_footer import Clusterwise_footers
from Periodic_report.check_with_districtwise_schools_and_students import District_wise_schools_students
from Periodic_report.check_with_grade_dropdown import periodic_grades
from Periodic_report.check_with_schoollevel_footer import Schoolwise_footers
from Periodic_report.click_on_Home_icon import Home

from Periodic_report.click_on_dashboard import Dashboard
from Periodic_report.click_on_periodic_report import Pat_Report_icon
from Periodic_report.click_on_periodic_report_and_logout import Logout

from reuse_func import GetData
import unittest

class periodic_functional_testing(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_periodic_report()
        self.data.page_loading(self.driver)

    def test_Pat_Report_icon(self):
        cls = Pat_Report_icon(self.driver)
        fnc = cls.check_landing_page()
        self.assertEqual(0,fnc,msg='Pat icon is not working ')
        print('Checked with pat icon is working fine ')
        self.data.page_loading(self.driver)

    def test_dashboard_patreport(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        self.data.navigate_to_periodic_report()
        time.sleep(3)
        if 'pat-report' in self.driver.current_url:
            print('Navigated to Periodic Assessment report')
        else:
            print('Pat report icon is not working')
            count = count + 1
        self.assertEqual(count,0,msg='Pat report button is not working')
        self.data.page_loading(self.driver)

    def test_gradesystem(self):
        b =periodic_grades(self.driver)
        res = b.check_grade_dropdown_options()
        self.assertEqual(0,res,msg="grade options not present ")
        print("Checked with grade options ")
        self.data.page_loading(self.driver)

    def test_grades_selection(self):
        b = periodic_grades(self.driver)
        res = b.click_each_grades()
        print("selected each grade options ")
        self.data.page_loading(self.driver)


    def test_subject_dropdown(self):
        b = periodic_grades(self.driver)
        res = b.check_subject_dropdown()
        self.assertNotEqual(0,res,msg="Subjects list are not present in dropdown")
        print("checked with subjectwise dropdown options ")
        self.data.page_loading(self.driver)

    def test_select_each_subjects(self):
        b = periodic_grades(self.driver)
        res = b.select_subjects_dropdown()
        print("selected each grade with all the subjects")
        self.data.page_loading(self.driver)

    def test_DistrictwiseCsv(self):
        cls = DistrictwiseCsv(self.driver)
        func = cls.click_download_icon()
        print('Downloading district level csv file is working')
        self.data.page_loading(self.driver)

    def  test_blockbutton_records(self):
        b = Block_level_records(self.driver)
        res1= b.click_download_icon_of_blocks()
        self.assertNotEqual(0,res1,msg='markers are not present on block levels')
        print('Block level records are working fine')
        self.data.page_loading(self.driver)

    def test_clusterbutton_records(self):
        b = ClusterwiseCsv(self.driver)
        res1= b.click_download_icon_of_clusters()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        print('cluster level records are working fine')
        self.data.page_loading(self.driver)

    def test_schoolbutton_records(self):
        b = SchoolwiseCsv(self.driver)
        res1= b.click_download_icon_of_schools()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        print('School level records are working fine')
        self.data.page_loading(self.driver)

    def test_each_districtwise(self):
        b = District(self.driver)
        res = b.check_district()
        self.assertEqual(0,res,msg='Some mis match found at districtwise records')
        print('Districtwise records are working fine')
        self.data.page_loading(self.driver)

    def test_district_blockwise(self):
        b = DistrictsBlock(self.driver)
        res = b.check_districts_block()
        self.assertEqual(0, res, msg='Some mis match found at blockwise records')
        print('Blockwise records are working fine')
        self.data.page_loading(self.driver)

    def test_district_block_clusterwise(self):
        b = DistrictBlockCluster(self.driver)
        res = b.check_district_block_cluster()
        self.assertEqual(0, res, msg='Some mis match found at school level records')
        print('School level records are working fine')
        self.data.page_loading(self.driver)

    def test_TotalStudentsSchools(self):
        b = TotalStudentsSchools(self.driver)
        res1,res2,res3,res4,res5,res6,res7,res8 = b.block_cluster_schools_footer_info()
        self.assertEqual(int(res1),int(res3),msg='Block level student info is mis matched')
        self.assertEqual(int(res2),int(res4),msg='Block level school info is mis matched')
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

    def test_homebtn(self):
        b = Home(self.driver)
        res = b.click_HomeButton()
        self.assertEqual(0,res,msg='home button is not worked ')
        print('Home button is working ')
        self.data.navigate_to_periodic_report()
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
        self.assertEqual('Log in to cQube',res ,msg='Logout button is not working')
        self.data.page_loading(self.driver)
        print('Logout button is button and navigated to login page ')
        self.data.login_cqube(self.driver)
        self.data.navigate_to_periodic_report()
        self.data.page_loading(self.driver)

    def test_dashboard(self):
        b=Dashboard(self.driver)
        res = b.click_on_dashboard()
        self.data.navigate_to_periodic_report()
        self.data.page_loading(self.driver)
        print('Dashboard to periodic report is working')
        self.data.page_loading(self.driver)



    def test_DotsOnDistricts(self):
        b = DotsOnDistricts(self.driver)
        res = b.check_dots_on_each_districts()
        self.assertEqual(0,res,msg='Some districts dont have markers ')
        print('Checked with markers on each district wise')
        self.data.page_loading(self.driver)


    def  test_blockbutton_footers(self):
        b = Block_level_footers(self.driver)
        res1,res2 = b.check_with_footervalues()
        self.assertNotEqual(0,res1,msg='markers are not present on block levels')
        self.assertEqual(0,res2,msg='Footer values mis match found')
        print('Block level records are working fine')
        self.data.page_loading(self.driver)

    def test_clusterbutton_footers(self):
        b = Clusterwise_footers(self.driver)
        res1, res2 = b.check_with_footervalues()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        self.assertEqual(0, res2, msg='Footer values mis match found')
        print('cluster level records are working fine')
        self.data.page_loading(self.driver)

    def test_schoolbutton_footers(self):
        b = Schoolwise_footers(self.driver)
        res1, res2 = b.check_with_footers()
        self.assertNotEqual(0, res1, msg='markers are not present on block levels')
        self.assertEqual(0, res2, msg='Footer values mis match found')
        print('School level records are working fine')
        self.data.page_loading(self.driver)

    def test_Districtwise_csv_download(self):
        b = Districtwise_csv_download(self.driver)
        res = b.check_district()
        self.assertEqual(0, res, msg='some districts csv file is not downloaded')
        print('Districtwise records are working fine')
        self.data.page_loading(self.driver)

    def test_Districts_Block_downloadcsv(self):
        b = Districts_Block_downloadcsv(self.driver)
        res = b.check_districts_block()
        self.assertEqual(0, res, msg='some blocks csv file is not downloaded')
        print('Blockwise records are working fine')
        self.data.page_loading(self.driver)

    def test_DistrictBlockCluster_donwloadcsv(self):
        b = DistrictBlockCluster_donwloadcsv(self.driver)
        res = b.check_district_block_cluster()
        self.assertEqual(0, res, msg='some school level csv file is not downloaded')
        print('School level records are working fine')
        self.data.page_loading(self.driver)

    def test_mouseover_on_tooltip(self):
        b = mouseover_on_tooltip(self.driver)
        res = b.test_mousehover()
        self.assertNotEqual(0,res,msg='Markers are not present on map')
        print('Checked with each markers on map ')
        self.data.page_loading(self.driver)

    def test_District_wise_schools_students(self):
        b = District_wise_schools_students(self.driver)
        res = b.check_dots_on_each_districts()
        self.assertEqual(0,res,msg='Some of districts dont have footer values ')
        print("Checked with footer values for each districts ")
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
