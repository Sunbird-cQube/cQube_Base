import time
import unittest
from Data.parameters import Data
from UDISE.check_with_no_of_schools_count import udise_districtwise_schoolvalue
from reuse_func import GetData

from UDISE.check_indices_with_download_functionality import udiseindices_scores
from UDISE.mouseover_on_districtwise import mouseover_on_map
from UDISE.Click_on_logout_button import click_on_logout
from UDISE.check_udise_map_blockwise_records import school_map_blockwise
from UDISE.check_udise_map_clusterwise_records import test_school_map_schoollevel_records

from UDISE.check_udise_map_districtwise_records import udise_map_districtwise
from UDISE.check_with_districtwise_markers import Click_on_each_districts
from UDISE.check_with_map_on_schoolinfra import check_markers_on_map
from UDISE.click_on_Dashboard import click_dashboard_udise_report
from UDISE.click_on_block_cluster_school_and_check_schoolscount import Block_cluster_school_for_udise

from UDISE.click_on_blocks_and_scores import block_btn_scores
from UDISE.click_on_blocksbtn_and_check_download import Blockwise_csv_download
from UDISE.click_on_cluster_check_download import clusterwise_download
from UDISE.click_on_clusters_and_scores import cluster_btn_scores
from UDISE.click_on_district_and_homeicon import district_home

from UDISE.click_on_hyperlink import click_on_hyperlink
from UDISE.click_on_schools_and_scores import schools_btn_scores
from UDISE.download_districtwise_csv import udise_districts_csv


class cQube_udise_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_udise_report()
        time.sleep(3)

    def test_dashboard(self):
        fun = click_dashboard_udise_report(self.driver)
        res = fun.test_dashboard()
        self.assertEqual(0,res,msg='udise report is failed to load by dashboard')
        self.data.page_loading(self.driver)

    def test_udise_icon(self):
        count =0
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'home' in self.driver.current_url:
            print('cQube Landing page is displayed and home button is working fine')
        else:
            print('Home button is not working')
            count = count + 1
        self.driver.find_element_by_id('udise').click()
        self.data.page_loading(self.driver)
        if 'UDISE report' in self.driver.page_source:
            print('UDISE Report home page is displayed ')
        else:
            print("Udise report is not exists ")
            count = count + 1
        self.assertEqual(0,count,msg='Udise report icon not working ')
        self.data.page_loading(self.driver)

    def test_check_markes_on_map(self):
        b = check_markers_on_map(self.driver)
        result = b.test_map()
        self.assertNotEqual(0, result, msg="Data not present on map")
        self.data.page_loading(self.driver)
        print("markers present on udise map report")

    def test_hyperlink(self):
        b = click_on_hyperlink(self.driver)
        res = b.test_link()
        if "udise-report" in self.driver.current_url:
            print("Udise map based report present")
        else:
            print("hyperlink is not working ")

    def test_download_districtcsv(self):
        fn = udise_districts_csv(self.driver)
        res = fn.test_districtwise()
        self.assertEqual(0,res,msg='Districtwise csv is not downloaded')
        self.data.page_loading(self.driver)

    def test_Click_on_each_districts(self):
        b =Click_on_each_districts(self.driver)
        res = b.test_districtlist()
        self.assertEqual(0,res,msg="Some districts does not have markers")
        self.data.page_loading(self.driver)

    def test_udise_map_districtwise(self):
        b =udise_map_districtwise(self.driver)
        res = b.test_districtwise()
        self.assertEqual(0,res,msg="Some district's csv file not downloaded")
        self.data.page_loading(self.driver)

    def test_test_school_map_schoollevel_records(self):
        b = test_school_map_schoollevel_records(self.driver)
        res = b.check_download_csv1()
        self.assertEqual(0,res,msg="Some school level csv file not downloaded")
        self.data.page_loading(self.driver)

    def test_clusterlevel_csvdownload(self):
        b = school_map_blockwise(self.driver)
        res = b.test_schools()
        self.assertEqual(0,res,msg="some cluster wise csv file downloading is failed")
        print("clusterlevel records with csv file downloading")
        self.data.page_loading(self.driver)

    def test_Block_cluster_school_for_udise(self):
        b = Block_cluster_school_for_udise(self.driver)
        res,res1,res2,res3 = b.test_check_total_schoolvalue()
        self.assertEqual(res,res1,msg="Block level school is same")
        self.assertEqual(res,res2,msg="Cluster level school is same")
        self.assertEqual(res,res3,msg="School level school is same")
        self.data.page_loading(self.driver)

    def test_block_wise_download(self):
        b = Blockwise_csv_download(self.driver)
        res, res1 = b.test_download_blockwise()
        self.assertTrue(res, msg='School level csv file is not downloaded')
        self.assertNotEqual(res1, 0, msg='Markers are missing on school level map ')
        print('blockwise csv file download is working')

    def test_cluster_wise_download(self):
        b = Blockwise_csv_download(self.driver)
        res, res1 = b.test_download_blockwise()
        self.assertTrue(res, msg='School level csv file is not downloaded')
        self.assertNotEqual(res1, 0, msg='Markers are missing on school level map ')
        print('clusterwise csv file download is working')

    def test_school_wise_download(self):
        b =clusterwise_download(self.driver)
        res,res1 = b.test_download()
        self.assertTrue(res,msg='School level csv file is not downloaded')
        self.assertNotEqual(res1,0,msg='Markers are missing on school level map ')
        print('Schoolwise csv file download is working')

    def test_homeicon(self):
        b = district_home(self.driver)
        res = b.test_district()
        print('checked with home icon is working or not ')
        self.data.page_loading(self.driver)

    def test_homebtn(self):
        count = 0
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'home' in self.driver.current_url:
            print('cQube Landing page is displayed and home button is working fine')
        else:
            print('Home button is not working')
            count = count + 1
        self.driver.find_element_by_id('udise').click()
        self.data.page_loading(self.driver)
        if 'UDISE report' in self.driver.page_source:
            print('UDISE Report home page is displayed ')
        else:
            print("Udise report is not exists ")
            count = count + 1
        self.assertEqual(0, count, msg='Udise report icon not working ')
        self.data.page_loading(self.driver)

    def test_logout(self):
        b =click_on_logout(self.driver)
        res = b.test_logout()
        self.assertEqual('Log in to cQube',res,msg='Logout button is not workig')
        self.data.page_loading(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_udise_report()
        if 'udise-report' in self.driver.current_url:
            print('Udise report home page is displayed ')
        self.data.page_loading(self.driver)

    def test_block_btn_scores(self):
        b = block_btn_scores(self.driver)
        res =b.test_click_blocks()
        self.assertEqual(0,res,msg='Markers are not present at selected indices')
        print('Checking block level with indices score dropdown')
        self.data.page_loading(self.driver)

    def test_cluster_btn_scores(self):
        b = cluster_btn_scores(self.driver)
        res =b.test_click_clusters()
        self.assertEqual(0,res,msg='Markers are not present at selected indices')
        print('Checking cluster level with indices score dropdown')
        self.data.page_loading(self.driver)

    def test_school_btn_scores(self):
        b = schools_btn_scores(self.driver)
        res =b.test_click_schools()
        self.assertEqual(0,res,msg='Markers are not present at selected indices')
        print('Checking school level with indices score dropdown')
        self.data.page_loading(self.driver)

    def test_mouse_over(self):
        b = mouseover_on_map(self.driver)
        res = b.test_mousehover()
        self.assertNotEqual(0,res,msg='Markers are not present on map')
        print("mouseover on each markers present on udise map")
        self.data.page_loading(self.driver)

    def test_indices_download(self):
        b = udiseindices_scores(self.driver)

        indices_score = b.infrastructure_score()
        b.remove_csv()
        self.assertNotEqual(0, indices_score, msg='Failed')

        administation = b.administation()
        b.remove_csv()
        self.assertNotEqual(0, administation, msg='Failed')

        artslab = b.artslab()
        b.remove_csv()
        self.assertNotEqual(0, artslab, msg='Failed')

        community = b.community()
        b.remove_csv()
        self.assertNotEqual(0, community, msg='Failed')

        Enrollment = b.Enrollment()
        b.remove_csv()
        self.assertNotEqual(0, Enrollment, msg='Failed')

        grant = b.grant_expenditure()
        b.remove_csv()
        self.assertNotEqual(0, grant, msg='Failed')

        ictlab = b.ictlab()
        b.remove_csv()
        self.assertNotEqual(0, ictlab, msg='Failed')

        Medical = b.Medical()
        b.remove_csv()
        self.assertNotEqual(0, Medical, msg='Failed')

        nsqf = b.nsqf()
        b.remove_csv()
        self.assertNotEqual(0, nsqf, msg='Failed')

        policy = b.policy()
        b.remove_csv()
        self.assertNotEqual(0, policy, msg='Failed')

        Safety = b.Safety()
        b.remove_csv()
        self.assertNotEqual(0, Safety, msg='Failed')

        School_infrastructure = b.School_infrastructure()
        b.remove_csv()
        self.assertNotEqual(0, School_infrastructure, msg='Failed')

        School_inspection = b.School_inspection()
        b.remove_csv()
        self.assertNotEqual(0, School_inspection, msg='Failed')

        School_perfomance = b.School_perfomance()
        b.remove_csv()
        self.assertNotEqual(0, School_perfomance, msg='Failed')

        Science_lab = b.Science_lab()
        b.remove_csv()
        self.assertNotEqual(0, Science_lab, msg='Failed')

        Teacher_profile = b.Teacher_profile()
        b.remove_csv()
        self.assertNotEqual(0, Teacher_profile, msg='Failed')
        print('selecting each indices and checking csv file is downloading or not ')
        self.data.page_loading(self.driver)

    def test_udise_districtwise_schoolvalue(self):
        b = udise_districtwise_schoolvalue(self.driver)
        res = b.test_districtwise_schools_count()
        self.assertEqual(0,res,msg='Some school count is mismatched')
        print('Checked with districtwise no of school values')
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


