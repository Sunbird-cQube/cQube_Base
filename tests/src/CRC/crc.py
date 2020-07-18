import os
import time
import unittest

from selenium.common import exceptions

from CRC.check_crc_block_per_district_csv_download import blockwise
from CRC.check_crc_cluster_per_block_report_csv_download import cluster_csv
from CRC.check_crc_school_per_cluster_csv_download import crc_schoollevel
from CRC.check_crc_tabledata_by_districtwise import schoolwise_tabledata
from CRC.check_crc_tabledata_by_select_district_block_and_cluster import check_district_block_cluster_tabledata

from CRC.check_crc_tabledata_by_selecting_district_and_block import blockwise_tabledata
from CRC.check_crc_tabledata_by_selecting_districts import districtwise_tabledata
from CRC.check_homebtn import Homebutton
from CRC.check_performance_for_blockwise_report import download_blockwise_csv
from CRC.check_performance_for_clusterwise_report import download_clusterwise_csv

from CRC.check_performance_for_district_block_cluster_tabledata_loading import clusterlevel_tabledata_loading
from CRC.check_performance_for_districtwise_report import download_districtwise_csv
from CRC.check_performance_for_schoolwise_report import download_schoolwise_csv
from CRC.check_performance_of_crc_report import CRC_report
from CRC.check_performance_of_schoolwise_csv_download import download_schoollevel_csv

from CRC.check_table_data_order import Check_order_of_tabledata
from CRC.check_total_no_of_visited_in_districtwise import visited
from CRC.check_total_no_of_visits_in_districtwise import school_visits
from CRC.check_totalschools_count_in_districtwise import school_count
from CRC.check_xaxis_and_yaxis_from_selectbox import plot_values

from CRC.click_on_district_block_cluster_home import click_on_home
from CRC.click_on_hyperlink import click_on_hyperlinks
from CRC.download_blockwise_csv import donwload_blockwise_csv
from CRC.download_clusterwise_csv import load_clusterwise_csv
from CRC.download_districtwise_csv import Districtwise_donwload

from CRC.download_schoolwise_csv import school_wise_download
from CRC.navigate_to_crc_and_click_on_logout import Logout_function
from CRC.navigate_to_crc_report import loading_crc
from CRC.navigate_to_dashboard import Dashboard_menu

from reuse_func import GetData


class cQube_CRC_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_crc_report()
            self.data.page_loading(self.driver)

    # def test_blockwise_data(self):
    #     b = blockwise(self.driver)
    #     result = b.test_blocklevel()
    #     self.assertEqual(0,result,msg="some district files are not downloaded")
    #
    # def test_clusterwise_csv_download(self):
    #     b = cluster_csv(self.driver)
    #     result = b.test_clusterlevel()
    #     self.assertEqual(0, result, msg="Block level records present in table ")
    #
    # def test_school_level(self):
    #     b =crc_schoollevel(self.driver)
    #     result = b.test_schoollevel()
    #     self.assertEqual(0,result,msg="cluster level records not downloaded")
    #
    # def test_table_data(self):
    #     b= schoolwise_tabledata(self.driver)
    #     result = b.test_table_data()
    #     self.assertNotEqual(0,result,"Data not found on table")
    #
    # # def test_schoolwise_tabledata(self):
    # #     b =check_district_block_cluster_tabledata(self.driver)
    # #     result = b.test_table_data()
    # #     if result != 0:
    # #         raise self.failureException('Data not found on table')
    #
    # # def test_clusterwise_tabledata(self):
    # #     b =blockwise_tabledata(self.driver)
    # #     result  = b.test_table_data()
    # #     if result != 0:
    # #         raise self.failureException('Data not found on table')
    #
    # def test_districtwise_tabledata(self):
    #      b= districtwise_tabledata(self.driver)
    #      result = b.test_table_data()
    #      if result != 0:
    #         raise self.failureException('Data not found on table')
    #
    # def test_homeicon(self):
    #     b=Homebutton(self.driver)
    #     result = b.test_homeicon()
    #     self.assertTrue(result,msg="Home button not working ")
    #
    # def test_peformance_blockwise(self):
    #     b = download_blockwise_csv(self.driver)
    #     result = b.test_blockwise()
    #     self.assertTrue(result, msg = "Blockwise csv is not downloaded")
    #     print("Block wise csv file is downloaded within 10 seconds")
    #     b.remove_file()
    #
    # def test_peformance_clusterwise(self):
    #     b = download_clusterwise_csv(self.driver)
    #     result = b.test_clusterwise()
    #     self.assertTrue(result, msg = "File is not downloaded")
    #     print("cluster wise csv file is downloaded within 10 seconds")
    #     b.remove_file()
    #
    #
    # def test_peformance_districtwise(self):
    #     b = download_districtwise_csv(self.driver)
    #     result = b.test_districtwise_csv()
    #     self.assertTrue(result, msg = "Districtwise csv is not downloaded")
    #     print("district wise csv file is downloaded within 10 seconds")
    #     b.remove_file()
    # #
    # # def test_peformance_schoolwise(self):
    # #     b = download_schoolwise_csv(self.driver)
    # #     result = b.test_schoolwise_csv()
    # #     self.assertTrue(result, msg="File is not downloaded")
    # #     print("school wise csv file is downloaded within 15 seconds ")
    # #     b.remove_file()
    #
    #
    # # def test_tabledata_loading_clusterlevel(self):
    # #     b = clusterlevel_tabledata_loading(self.driver)
    # #     result = b.test_table_data()
    # #     if result != 0:
    # #         raise self.failureException('Data not found on table')
    # #     else:
    # #         print("District , block and cluster table data is loaded within 3 seconds ")
    #
    # def test_peformance_of_crc_report(self):
    #     b = CRC_report(self.driver)
    #     result = b.test_crc_report()
    #     if "crc-report" in self.driver.current_url:
    #         print("CRC report page is exists")
    #     else:
    #         print("CRC report page is not loaded ")
    #
    # def test_schoolwise_csv(self):
    #     b = download_schoollevel_csv(self.driver)
    #     result = b.test_schoolwise()
    #     self.assertTrue(result, msg="File is not downloaded within 20 seconds")
    #     b.remove_csv()
    # #
    # def test_orderwise_tabledataa(self):
    #     b = Check_order_of_tabledata(self.driver)
    #     result = b.test_order()
    #     self.assertEqual(result,"menu",msg="Menu is not exist")

    def test_crc_graph(self):
        b = plot_values(self.driver)
        result = b.test_plots()
        self.assertNotEqual(0,result,msg="Axis options are not contains in select box")

    # def test_clusterlevel_homeicon(self):
    #     b = click_on_home(self.driver)
    #     result = b.test_homeicon()
    #     if "crc-report" in self.driver.current_url:
    #         print("crc home page is loaded")
    #     else:
    #         print("crc home page is not loaded")
    #
    # def test_on_clusterlevel_to_hyperlinks(self):
    #     b = click_on_hyperlinks(self.driver)
    #     result = b.test_hyperlink()
    #
    # def test_download_blockwise_csv(self):
    #     b = donwload_blockwise_csv(self.driver)
    #     result = b.test_blockwise()
    #     self.assertTrue(result, msg="File is not downloaded")
    #     b.remove_file()
    #
    # def test_donwoad_clusterwise_csv(self):
    #     b = load_clusterwise_csv(self.driver)
    #     result = b.test_clusterwise()
    #     self.assertTrue(result, msg = "File is not downloaded")
    #     b.remove_file()
    #
    #
    # def test_visited(self):
    #     b =visited(self.driver)
    #     result1,result2 = b.test_schools()
    #     self.assertEqual(int(result1),result2, msg="total no of visited are mismatching in district level")
    #     b.remove_file()
    #
    # def test_visits(self):
    #     b =school_visits(self.driver)
    #     res1 ,res2  =b.test_visits()
    #     self.assertEqual(int(res1),res2, msg="total no of visits are mismatching in district level")
    #     b.remove_file()
    #
    # def test_schoolcount(self):
    #     b = school_count(self.driver)
    #     res1, res2 = b.test_schools()
    #     self.assertEqual(int(res1), res2, msg="total no of school are mismatching in district level")
    #     b.remove_csv()
    # #
    # def test_download_districtwise(self):
    #     b = Districtwise_donwload(self.driver)
    #     result  = b.test_districtwise()
    #     self.assertTrue(result, msg="File is not downloaded")
    #     b.remove_csv()
    #
    # def test_download_schoolwise(self):
    #     b =school_wise_download(self.driver)
    #     res = b.test_schoolwise()
    #     self.assertTrue(res, msg="File is not downloaded")
    #     b.remove_file()
    #
    # def test_logout(self):
    #     b = Logout_function(self.driver)
    #     res = b.test_logout()
    #     if "crc-report" in self.driver.current_url:
    #         print("Navigated back to crc report")
    #     else:
    #         print("CRC report is not loaded ")
    #
    #
    # def test_navigate_crc(self):
    #     b =loading_crc(self.driver)
    #     res = b.test_crc()
    #     if "crc-report" in self.driver.current_url:
    #         print("Navigated back to crc report")
    #     else:
    #         print("CRC report is not loaded ")
    #
    def test_dash_menu(self):
        b =Dashboard_menu(self.driver)
        res = b.test_dashboard()
        self.assertEqual(res,"menu",msg="Dashboard button is not working")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()













































































