import time
import unittest

from Data.parameters import Data
from UDISE.click_on_clusters import cluster_button
from UDISE.click_on_schools import click_schoolbutton
from reuse_func import GetData
from UDISE.check_indices_with_download_functionality import udiseindices_scores
from UDISE.check_udise_map_clusterwise_records import test_school_map_schoollevel_records
from UDISE.click_on_block_cluster_school_and_check_schoolscount import Block_cluster_school_for_udise

from UDISE.click_on_blocks_and_scores import block_btn_scores
from UDISE.click_on_blocksbtn_and_check_download import Blockwise_csv_download
from UDISE.click_on_clusters_and_scores import cluster_btn_scores

from UDISE.click_on_hyperlink import click_on_hyperlink
from UDISE.download_districtwise_csv import udise_districts_csv


class cQube_udise_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(60)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_udise_report()
        time.sleep(3)

    def test_udise_icon(self):
        count =0
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print('cQube Landing page is displayed and home button is working fine')
        else:
            print('Home button is not working')
            count = count + 1
        self.driver.find_element_by_id('udise').click()
        self.data.page_loading(self.driver)
        if 'udise-report' in self.driver.current_url:
            print('UDISE Report home page is displayed ')
        else:
            print("Udise report is not exists ")
            count = count + 1
        self.assertEqual(0,count,msg='Udise report icon not working ')
        self.data.page_loading(self.driver)

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


    def test_test_school_map_schoollevel_records(self):
        b = test_school_map_schoollevel_records(self.driver)
        res = b.check_download_csv1()
        self.assertEqual(0,res,msg="Some school level csv file not downloaded")
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
        self.assertTrue(res, msg='Block level csv file is not downloaded')
        self.assertNotEqual(res1, 0, msg='Markers are missing on school level map ')
        print('blockwise csv file download is working')

    def test_cluster_wise_download(self):
        b = cluster_button(self.driver)
        res, res1 = b.test_clusterbtn()
        self.assertTrue(res, msg='Cluster level csv file is not downloaded')
        self.assertNotEqual(res1, 0, msg='Markers are missing on school level map ')
        print('clusterwise csv file download is working')

    def test_school_wise_download(self):
        b =click_schoolbutton(self.driver)
        res,res1 = b.test_click_on_school_btn()
        self.assertTrue(res,msg='School level csv file is not downloaded')
        self.assertNotEqual(res1,0,msg='Markers are missing on school level map ')
        print('Schoolwise csv file download is working')

    def test_homebtn(self):
        count = 0
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print('cQube Landing page is displayed and home button is working fine')
        else:
            print('Home button is not working')
            count = count + 1
        self.driver.find_element_by_id('udise').click()
        self.data.page_loading(self.driver)
        if 'udise-report' in self.driver.current_url:
            print('UDISE Report home page is displayed ')
        else:
            print("Udise report is not exists ")
            count = count + 1
        self.assertEqual(0, count, msg='Udise report icon not working ')
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




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


