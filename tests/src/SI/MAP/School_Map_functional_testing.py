import time
import unittest

from selenium.common import exceptions

from SI.MAP.Click_on_School_infra import click_schoolinfra
from SI.MAP.check_districtwise_school import districtlevel_school
from SI.MAP.check_infrascore_with_download_functionality import SchoolInfra_scores
from SI.MAP.check_with_districts_from_select_box import District_names
from SI.MAP.check_with_map_on_schoolinfra import check_markers_on_map
from SI.MAP.check_with_schoolinfra_options import School_infra_options


from SI.MAP.click_on_Dashboard import click_dashboard
from SI.MAP.click_on_District_block_and_clusters import select_Dist_block_cluster
from SI.MAP.click_on_Report_from_scinfra import click_report
from SI.MAP.click_on_Reportmap import click_on_reportmap
from SI.MAP.click_on_anydistrict_and_download_csv import download_icon

from SI.MAP.click_on_blk_clus_school_and_home import click_on_home
from SI.MAP.click_on_block_and_home import block_level_home
from SI.MAP.click_on_block_check_with_footer_values import school_count
from SI.MAP.click_on_block_cluster_school_and_check_schoolscount import Block_school_count
from SI.MAP.click_on_blocks import click_on_blocks
from SI.MAP.click_on_blocks_and_scores import block_btn_scores

from SI.MAP.click_on_blocksbtn_and_check_download import Blockwise_csv_download
from SI.MAP.click_on_blockwise_download_csv import cluster_level_map_check
from SI.MAP.click_on_cluster_and_home import click_cluster_and_home
from SI.MAP.click_on_cluster_check_download import clusterwise_download
from SI.MAP.click_on_clusters import cluster_button
from SI.MAP.click_on_clusters_and_scores import cluster_btn_scores

from SI.MAP.click_on_district_and_homeicon import district_home
from SI.MAP.click_on_district_options import District_options
from SI.MAP.click_on_hyperlink import click_on_hyperlink
from SI.MAP.click_on_infra_score import click_on_infrascores
from SI.MAP.click_on_infra_scores_options import select_infrascore_options

from SI.MAP.click_on_school_and_check_download import  school_wise_download
from SI.MAP.click_on_school_infrastructure import School_infra_test
from SI.MAP.click_on_schools import click_schoolwise
from SI.MAP.click_on_schools_and_scores import schools_btn_scores
from SI.MAP.download_clusterlevel_csv import cluster_level_csv
from SI.MAP.download_districtwise_csv import districtwise_csv

from SI.MAP.mouseover_on_districtwise import mouseover
from SI.MAP.select_district_block_from_select_box import select_blockwise

from reuse_func import GetData


class cQube_SI_Map_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 35
        self.tests = [0] * 36
        self.data = GetData()
        self.logger = self.data.get_functional_log("schoolinframap")
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure_map()
        self.data.page_loading(self.driver)

    def test_check_district_names(self):
        self.tests.pop()
        self.logger.info("test_check_district_names" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = District_names(self.driver)
        result = b.test_districtlist()
        self.assertNotEqual(0,result,msg="All Districts are not present in select box!..")
        print("Checked with district select box contains options or not")
        self.logger.info("test_check_district_names is completed...")

    def test_check_markes_on_map(self):
        self.tests.pop()
        self.logger.info("test_check_markes_on_map" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = check_markers_on_map(self.driver)
        result = b.test_map()
        self.assertNotEqual(0,result,msg="Data not present on map")
        print("checking markers on map ")
        self.logger.info("test_check_markes_on_map is completed...")

    def test_infrascore(self):
        self.tests.pop()
        self.logger.info("test_infrascore" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = SchoolInfra_scores(self.driver)
        infra_score = b.infra_score()
        b.remove_csv()
        print("infra scores validations")
        self.assertNotEqual(0,infra_score, msg='Failed')

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
        self.logger.info("test_infrascore is completed...")



    def test_school_infra_options(self):
        self.tests.pop()
        self.logger.info("test_school_infra_options" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = School_infra_options(self.driver)
        res1,res2 = b.test_options()
        self.assertEqual(res1, "Report", msg="option is not available")
        self.assertEqual(res2, "Map based Report", msg="option is not available")
        self.data.page_loading(self.driver)
        print("school infra options..")
        self.logger.info("test_school_infra_options is completed...")


    def test_download(self):
        self.tests.pop()
        self.logger.info("test_download" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = download_icon(self.driver)
        res = b.test_donwload()
        if "school-infra-map" in self.driver.current_url:
            print("School infrastructure map based report present")
        else:
            print("School infra map report is not exist")
        self.logger.info("test_download is completed...")


    def test_click_on_home(self):
        self.tests.pop()
        self.logger.info("test_click_on_home" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = click_on_home(self.driver)
        c1 , c2 ,c3 =b.test_home()
        self.assertNotEqual(0, c1, msg="Records are not present on map ")
        self.assertNotEqual(0, c2, msg="Records are not present on map ")
        self.assertNotEqual(0, c3, msg="Records are not present on map ")
        print("checking up with footer values in all blocks , cluster and school levels")
        self.logger.info("test_click_on_home is completed...")


    def test_blockelevel_home_click(self):
        self.tests.pop()
        self.logger.info("test_blockelevel_home_click" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = block_level_home(self.driver)
        res = b.test_blocks()
        if "school-infra-map" in self.driver.current_url:
            print("School infra map based report")
        else:
            print("school infra map report is not loaded ")
        self.logger.info("test_blockelevel_home_click is completed...")


    def test_school_count(self):
        self.tests.pop()
        self.logger.info("test_school_count" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = school_count(self.driver)
        res = b.test_count()
        self.assertNotEqual(0,int(res),msg="wrong schools count")
        print("compare school count footer values with downloaded csv values count is matching or not")
        self.logger.info("test_school_count is completed...")
    #
    def test_no_of_schools(self):
        self.tests.pop()
        self.logger.info("test_no_of_schools" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = Block_school_count(self.driver)
        r,r1,r2,r3 = b.test_counter()
        self.assertEqual(int(r), int(r1), msg="mis match found in no of school in block level")
        self.assertEqual( int(r) ,int(r2) , msg="mis match found in no of school in cluster level")
        self.assertEqual(int(r) , int(r3), msg="mis match found in no of school in school level")
        self.data.page_loading(self.driver)
        print("compare no of schools footer values with downloaded csv values count is matching or not")
        self.logger.info("test_no_of_schools is completed...")

    def test_click_on_block(self):
        self.tests.pop()
        self.logger.info("test_click_on_block" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =click_on_blocks(self.driver)
        res = b.test_blocks_button()
        self.assertNotEqual(0,res,msg="Records are not present on map ")
        print("checking block button is working or not ")
        self.logger.info("test_click_on_block is completed...")


    def test_blocklevel_file(self):
        self.tests.pop()
        self.logger.info("test_blocklevel_file" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =Blockwise_csv_download(self.driver)
        result =b.test_download_blockwise()
        self.assertNotEqual(0,result,msg="Records are not present on map ")
        print("downloading block level csv files")
        self.logger.info("test_blocklevel_file is completed...")


    def test_clusterlevel_map(self):
        self.tests.pop()
        self.logger.info("test_clusterlevel_map" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =cluster_level_map_check(self.driver)
        result = b.test_blockwise_data()
        self.assertNotEqual(0,result,msg="markers are not present on map ")
        print("checking up with cluster level maps contains markers or not")
        self.logger.info("test_clusterlevel_map is completed...")


    def test_cluster_and_homebtn(self):
        self.tests.pop()
        self.logger.info("test_cluster_and_homebtn" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =click_cluster_and_home(self.driver)
        res = b.test_cluster()
        self.assertNotEqual(0,res,msg="cluster level markers not present on map ")
        print("checking home button ")
        self.logger.info("test_cluster_and_homebtn is completed...")

    def test_clusterwise_download(self):
        self.tests.pop()
        self.logger.info("test_clusterwise_download" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=clusterwise_download(self.driver)
        result = b.test_download()
        self.assertNotEqual(0,result,msg="Records are not present on map ")
        print("Downloading clusterwise csv files")
        self.logger.info("test_clusterwise_download is completed...")

    def test_clusterbtn(self):
        self.tests.pop()
        self.logger.info("test_clusterbtn" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =cluster_button(self.driver)
        self.assertNotEqual(0,b,msg="Records are not present on map ")
        print("checking with cluster button")
        self.logger.info("test_clusterbtn is completed...")

    def test_dashboard(self):
        self.tests.pop()
        self.logger.info("test_dashboard" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=click_dashboard(self.driver)
        res =b.test_dashboard()
        self.assertEqual("cQube - Dashboard",res,msg="Dashboard is not exists!")
        print("Dash board options ")
        self.logger.info("test_dashboard is completed...")
        self.data.page_loading(self.driver)


    def test_click_home_in_districtwise(self):
        self.tests.pop()
        self.logger.info("test_click_home_in_districtwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =district_home(self.driver)
        res = b.test_district()
        if "school-infra-map" in self.driver.current_url:
            print("school infra map based report present")
        else:
            print("home icon is not working ")
        self.logger.info("test_click_home_in_districtwise is completed...")


    def test_district_options(self):
        self.tests.pop()
        self.logger.info("test_district_options" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = District_options(self.driver)
        res = b.test_options()
        self.assertNotEqual(0,res,msg="district list are present")
        print("district options ...")
        self.logger.info("test_district_options is completed...")


    def test_hyperlink(self):
        self.tests.pop()
        self.logger.info("test_hyperlink" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =click_on_hyperlink(self.driver)
        res = b.test_link()
        if "school-infra-map" in self.driver.current_url:
            print("school infra map based report present")
        else:
            print("home icon is not working ")
        self.logger.info("test_hyperlink is completed...")

    def test_infrascores(self):
        self.tests.pop()
        self.logger.info("test_infrascores" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=click_on_infrascores(self.driver)
        res = b.test_infrascores()
        self.assertNotEqual(0,res,msg="infra score options not contains in drop down")
        print("selecting each infra score dropdown")
        self.logger.info("test_infrascores is completed...")

    def test_report(self):
        self.tests.pop()
        self.logger.info("test_report" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=click_report(self.driver)
        self.data.page_loading(self.driver)
        res = b.test_infra()
        if "school-infrastructure" in self.driver.current_url:
            print("Shool infrastructure report page")
        else:
            print("School infrastructure report page is not exist")
        self.data.page_loading(self.driver)
        self.logger.info("test_report is completed...")

    def test_reportmap(self):
        self.tests.pop()
        self.logger.info("test_reportmap" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =click_on_reportmap(self.driver)
        self.data.page_loading(self.driver)
        res = b.test_reportmap()
        self.assertEqual("cQube - Dashboard",res,msg="Dashboard is not exists!")
        print("navigate back to school infra map based report ")
        self.data.page_loading(self.driver)
        self.logger.info("test_reportmap is completed...")

    def test_schoolwise_download(self):
        self.tests.pop()
        self.logger.info("test_schoolwise_download" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=school_wise_download(self.driver)
        res = b.test_schoolwise()
        time.sleep(3)
        self.assertNotEqual(0,res,msg="Records are not present on map ")
        print("Downloading schoolwise csv file")
        self.logger.info("test_schoolwise_download is completed...")

    def test_click_on_school(self):
        self.tests.pop()
        self.logger.info("test_click_on_school" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b= click_schoolinfra(self.driver)
        res = b.test_schoolinfra()
        if "school-infrastructure" in self.driver.current_url:
            print("School-infrastructure page")
        else:
            print("Not school-infrastructure page")
        self.logger.info("test_click_on_school is completed...")

    def test_click_schoolwise(self):
        self.tests.pop()
        self.logger.info("test_click_schoolwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =click_schoolwise(self.driver)
        self.assertNotEqual(0,b,msg="Records are not present on map ")
        print("click on schoolwise")
        self.logger.info("test_click_schoolwise is completed...")


    def test_dashboard_option(self):
        self.tests.pop()
        self.logger.info("test_dashboard_option" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=School_infra_test(self.driver)
        res = b.test_dashboard_option()
        if "school-infra-map" in self.driver.current_url:
            print("School infra map based report page exist")
        else:
            print("School infra map based report page not exist")
        self.data.page_loading(self.driver)
        self.logger.info("test_dashboard_option is completed...")

    def test_infrascore_click(self):
        self.tests.pop()
        self.logger.info("test_infrascore_click" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = select_infrascore_options(self.driver)
        res = b.test_infrascores()
        self.assertNotEqual(0, res, msg="infra score options not contains in drop down")
        print("check with infra scores drop down and read the values ")
        self.logger.info("test_infrascore_click is completed...")

    def test_clusterwise_csv(self):
        self.tests.pop()
        self.logger.info("test_clusterwise_csv" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =cluster_level_csv(self.driver)
        res = b.test_clusterwise()
        print("check with cluster wise csv file downloading ")
        self.logger.info("test_clusterwise_csv is completed...")

    def test_districtwise_csv(self):
        self.tests.pop()
        self.logger.info("test_districtwise_csv" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =districtwise_csv(self.driver)
        res  =b.test_districtwise()
        print("check with district wise csv download")
        self.logger.info("test_districtwise_csv is completed...")

    def test_mouseover_on_dots(self):
        self.tests.pop()
        self.logger.info("test_mouseover_on_dots" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("mouse over on all markers present on screen")
        b = mouseover(self.driver)
        res  =b.test_mousehover()
        count = self.data.test_mouse_over()
        self.assertNotEqual(0,count,msg="markers not present in map ")
        self.logger.info("test_mouseover_on_dots is completed...")


    def test_blockwise(self):
        self.tests.pop()
        self.logger.info("test_blockwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("blockwise records validation")
        b =select_blockwise(self.driver)
        res = b.test_dist_blocks()
        self.logger.info("test_blockwise is completed...")

    def test_block_scores(self):
        self.tests.pop()
        self.logger.info("test_block_scores" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking with block level values")
        b =block_btn_scores(self.driver)
        result = b.test_click_blocks()
        self.data.page_loading(self.driver)
        self.logger.info("test_block_scores is completed...")


    def test_clusters_scores(self):
        self.tests.pop()
        self.logger.info("test_clusters_scores" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking with cluster level values")
        b = cluster_btn_scores(self.driver)
        result = b.test_click_clusters()
        self.data.page_loading(self.driver)
        self.logger.info("test_clusters_scores is completed...")


    def test_schools_scores(self):
        self.tests.pop()
        self.logger.info("test_schools_scores" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking with school level values")
        b = schools_btn_scores(self.driver)
        res = b.test_click_schools()
        self.data.page_loading(self.driver)
        self.logger.info("test_schools_scores is completed...")


    def test_districtwise_school(self):
        self.tests.pop()
        self.logger.info("test_districtwise_school" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = districtlevel_school(self.driver)
        result = b.test_districtwise_schoolscount()
        self.assertNotEqual(0,result, msg="markers are not present on map ")
        self.data.page_loading(self.driver)
        print("district wise records working fine")
        self.logger.info("test_districtwise_school is completed...")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

