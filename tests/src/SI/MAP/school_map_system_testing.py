import time
import unittest

from Data.parameters import Data

from SI.MAP.check_infrascore_with_download_functionality import SchoolInfra_scores
from SI.MAP.check_sc_map_blockwise_records import school_map_blockwise
from SI.MAP.check_sc_map_clusterwise_records import test_school_map_schoollevel_records
from SI.MAP.check_sc_map_districtwise_records import sc_map_districtwise
from SI.MAP.check_with_map_on_schoolinfra import check_markers_on_map

from SI.MAP.click_on_Dashboard import click_dashboard
from SI.MAP.click_on_anydistrict_and_download_csv import download_icon
from SI.MAP.click_on_blk_clus_school_and_home import click_on_home
from SI.MAP.click_on_block_cluster_school_and_check_schoolscount import Block_cluster_school_count
from SI.MAP.click_on_blocks import click_on_blocks

from SI.MAP.click_on_blocks_and_scores import block_btn_scores
from SI.MAP.click_on_blocksbtn_and_check_download import Blockwise_csv_download
from SI.MAP.click_on_cluster_check_download import clusterwise_download
from SI.MAP.click_on_clusters import cluster_button
from SI.MAP.click_on_clusters_and_scores import cluster_btn_scores

from SI.MAP.click_on_hyperlink import click_on_hyperlink
from SI.MAP.click_on_school_and_check_download import school_wise_download
from SI.MAP.click_on_schools_and_scores import schools_btn_scores
from SI.MAP.mouseover_on_districtwise import mouseover

from reuse_func import GetData


class cQube_SI_Map_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure_map()
        time.sleep(5)

    def test_dashboard(self):
        b = click_dashboard(self.driver)
        res = b.test_dashboard()
        self.assertEqual("cQube - Dashboard", res, msg="Dashboard is not exists!")
        print("checked with dashboard ")
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = click_on_hyperlink(self.driver)
        res = b.test_link()
        if "school-infra-map" in self.driver.current_url:
            print("school infra map based report present")
        else:
            print("hyperlink is not working ")

    def test_districtwise_download(self):
        b = download_icon(self.driver)
        res = b.test_donwload()
        if "school-infra-map" in self.driver.current_url:
            print("School infrastructure map based report present")
        else:
            print("School infra map report is not exist")

    def test_sc_map_districtwise(self):
        b = sc_map_districtwise(self.driver)
        result = b.test_schools()
        print("district wise map records checked")

    def test_sc_map_blockwise(self):
        b = school_map_blockwise(self.driver)
        result = b.test_schools()
        self.assertEqual(0, result, msg="No data found")
        print("blockwise wise map records checked")

    def test_schools_per_cluster_csv_download1(self):
        school = test_school_map_schoollevel_records(self.driver)
        result = school.check_download_csv1()
        if result == 0:
            print("Schools per cluster csv download report is working")
            print("on selection of each district,block and cluster")
            print("The footer value of no of schools and no of students are")
            print("equals to downloaded file")
        else:
            raise self.failureException("Schools per cluster csv report download1 is working")


    def test_click_on_home(self):
        b = click_on_home(self.driver)
        c1, c2, c3 = b.test_home()
        self.assertNotEqual(0, c1, msg="Records are not present on map ")
        self.assertNotEqual(0, c2, msg="Records are not present on map ")
        self.assertNotEqual(0, c3, msg="Records are not present on map ")
        print("cluser level home icon is working")

    def test_logout(self):
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)
        count = 0
        if 'Login in to cQube' in self.driver.title:
            print('logout button is working and Login page is displayed')
        else:
            print("logout button is not working ")
            count = count + 1
        self.assertEqual(0, count, msg='logout button is not worked')

    def test_infrascore(self):
        b = SchoolInfra_scores(self.driver)
        infra_score = b.infra_score()
        b.remove_csv()
        self.assertNotEqual(0, infra_score, msg='Failed')

        boy_toilet = b.Boys_toilet_percentage()
        b.remove_csv()
        self.assertNotEqual(0, boy_toilet, msg='Failed')

        drinking_water = b.drinking_water()
        b.remove_csv()
        self.assertNotEqual(0, drinking_water, msg='Failed')

        Electricity = b.Electricity()
        b.remove_csv()
        self.assertNotEqual(0, Electricity, msg='Failed')

        girl_toilet = b.girls_toilet()
        b.remove_csv()
        self.assertNotEqual(0, girl_toilet, msg='Failed')

        Handpump = b.Handpump()
        b.remove_csv()
        self.assertNotEqual(0, Handpump, msg='Failed')

        Handwash = b.Handwash()
        b.remove_csv()
        self.assertNotEqual(0, Handwash, msg='Failed')

        Library = b.Library()
        b.remove_csv()
        self.assertNotEqual(0, Library, msg='Failed')

        Solar_panel = b.Solar_panel()
        b.remove_csv()
        self.assertNotEqual(0, Solar_panel, msg='Failed')

        Tapwater = b.Tapwater()
        b.remove_csv()
        self.assertNotEqual(0, Tapwater, msg='Failed')

        Toilet = b.Toilet()
        b.remove_csv()
        self.assertNotEqual(0, Toilet, msg='Failed')

    def test_click_on_block(self):
        b = click_on_blocks(self.driver)
        res = b.test_blocks_button()
        self.assertNotEqual(0, res, msg="Records are not present on map ")
        print("Block buttons is working...")

    def test_clusterbtn(self):
        b = cluster_button(self.driver)
        self.assertNotEqual(0, b, msg="Records are not present on map ")
        print("cluster button is working ")

    def test_no_of_schools(self):
        b = Block_cluster_school_count(self.driver)
        r, r1, r2, r3 = b.test_check_total_schoolvalue()
        self.assertEqual(int(r), int(r1), msg="mis match found in no of school in block level")
        self.assertEqual(int(r), int(r2), msg="mis match found in no of school in cluster level")
        self.assertEqual(int(r), int(r3), msg="mis match found in no of school in school level")
        self.data.page_loading(self.driver)
        print("checked with comapared with footer values ")

    def test_block_scores(self):
        b = block_btn_scores(self.driver)
        result = b.test_click_blocks()
        self.data.page_loading(self.driver)
        print("block button is worked and infra scores is working ")

    def test_clusters_scores(self):
        b = cluster_btn_scores(self.driver)
        result = b.test_click_clusters()
        self.data.page_loading(self.driver)
        print("cluster button is worked and infra scores is working ")

    def test_schools_scores(self):
        b = schools_btn_scores(self.driver)
        res = b.test_click_schools()
        self.data.page_loading(self.driver)
        print("school button is worked and infra scores is working ")


    def test_check_markes_on_map(self):
        b = check_markers_on_map(self.driver)
        result = b.test_map()
        self.assertNotEqual(0, result, msg="Data not present on map")
        self.data.page_loading(self.driver)
        print("markers on map ")

    def test_blocklevel_file(self):
        b = Blockwise_csv_download(self.driver)
        res1, res2 = b.test_download_blockwise()
        self.assertTrue(res1, msg="Blockwise csv file is not downloaded")
        self.assertNotEqual(0, res2, msg="markers are not present on block level map ")
        print("blocklevel file is downloaded")

    def test_clusterwise_download(self):
        b = clusterwise_download(self.driver)
        res1, res2 = b.test_download()
        self.assertTrue(res1, msg="clusterwise csv file is not downloaded")
        self.assertNotEqual(0, res2, msg="markers are not present on block level map ")
        print("cluster wise csv is downloading working")

    def test_schoolwise_download(self):
        b = school_wise_download(self.driver)
        res1, res2 = b.test_schoolwise()
        self.assertTrue(res1, msg="School level csv file is not downloaded")
        self.assertNotEqual(0, res2, msg="markers are not present on block level map ")
        print("school wise csv is downloaded")

    def test_mouseover_on_dots(self):
        b = mouseover(self.driver)
        res = b.test_mousehover()
        count = self.data.test_mouse_over()
        self.assertNotEqual(0, count, msg="markers not present in map ")
        print("markers present on map ")












    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

