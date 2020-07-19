import os
import time
import unittest


from CRC.check_blockwise_graph import Blockwise_graph
from CRC.check_blockwise_records import crc_blockwise_records
from CRC.check_clusterwise_graph import cluster_graph
from CRC.check_crc_block_per_district_csv_download import blockwise
from CRC.check_crc_tabledata_by_districtwise import schoolwise_tabledata

from CRC.check_crc_tabledata_by_selecting_districts import districtwise_tabledata
from CRC.check_districtlevel_visited import districtwise_visits
from CRC.check_homebtn import Homebutton
from CRC.check_performance_for_blockwise_report import download_blockwise_csv
from CRC.check_performance_for_clusterwise_report import download_clusterwise_csv

from CRC.check_performance_for_districtwise_report import download_districtwise_csv
from CRC.check_performance_of_crc_report import CRC_report
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
from CRC.navigate_to_crc_and_click_on_logout import Logout_function
from CRC.navigate_to_crc_report import loading_crc
from CRC.navigate_to_dashboard import Dashboard_menu

from reuse_func import GetData


class cQube_CRC_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.total_tests =25
            self.tests = [0] * 26
            self.data = GetData()
            self.logger = self.data.get_functional_log("crc")
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_crc_report()
            self.data.page_loading(self.driver)

    def test_blockwise_data(self):
        self.tests.pop()
        self.logger.info("test_blockwise_data" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = blockwise(self.driver)
        result = b.test_blocklevel()
        self.assertEqual(0,result,msg="some district files are not downloaded")
        print("blockwise csv files are downloaded")
        self.logger.info("test_blockwise_data is completed...")

    def test_table_data(self):
        self.tests.pop()
        self.logger.info("test_table_data" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b= schoolwise_tabledata(self.driver)
        result = b.test_table_data()
        self.assertNotEqual(0,result,"Data not found on table")
        print("Table contains records...")
        self.logger.info("test_table_data is completed...")


    def test_districtwise_tabledata(self):
        self.tests.pop()
        self.logger.info("test_districtwise_tabledata" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = districtwise_tabledata(self.driver)
        result = b.test_table_data()
        if result != 0:
            raise self.failureException('Data not found on table')
        print("Check with Districtwise table records")
        self.logger.info("test_districtwise_tabledata is completed...")

    def test_homeicon(self):
        self.tests.pop()
        self.logger.info("test_homeicon" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b=Homebutton(self.driver)
        result = b.test_homeicon()
        self.assertTrue(result,msg="Home button not working ")
        print("checking functionality of home button ")
        self.logger.info("test_homeicon is completed...")

    def test_peformance_blockwise(self):
        self.tests.pop()
        self.logger.info("test_peformance_blockwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = download_blockwise_csv(self.driver)
        result = b.test_blockwise()
        self.assertTrue(result, msg = "Blockwise csv is not downloaded")
        print("Block wise csv file is downloaded within 10 seconds")
        b.remove_file()
        self.logger.info("test_peformance_blockwise is completed...")

    def test_peformance_clusterwise(self):
        self.tests.pop()
        self.logger.info("test_peformance_clusterwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = download_clusterwise_csv(self.driver)
        result = b.test_clusterwise()
        self.assertTrue(result, msg = "File is not downloaded")
        print("cluster wise csv file is downloaded within 10 seconds")
        b.remove_file()
        self.logger.info("test_peformance_clusterwise is completed...")


    def test_peformance_districtwise(self):
        self.tests.pop()
        self.logger.info("test_peformance_districtwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = download_districtwise_csv(self.driver)
        result = b.test_districtwise_csv()
        self.assertTrue(result, msg = "Districtwise csv is not downloaded")
        print("district wise csv file is downloaded within 10 seconds")
        b.remove_file()
        self.logger.info("test_peformance_districtwise is completed...")



    def test_peformance_of_crc_report(self):
        self.tests.pop()
        self.logger.info("test_peformance_of_crc_report" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = CRC_report(self.driver)
        result = b.test_crc_report()
        if "crc-report" in self.driver.current_url:
            print("CRC report page is exists")
        else:
            print("CRC report page is not loaded ")
        self.logger.info("test_peformance_of_crc_report is completed...")



    def test_orderwise_tabledata(self):
        self.tests.pop()
        self.logger.info("test_orderwise_tabledata" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking order of table records")
        b = Check_order_of_tabledata(self.driver)
        result = b.test_order()
        self.assertEqual(result,"menu",msg="Menu is not exist")
        self.logger.info("test_orderwise_tabledata is completed...")


    def test_crc_graph(self):
        self.tests.pop()
        self.logger.info("test_crc_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = plot_values(self.driver)
        result = b.test_plots()
        self.assertNotEqual(0,result,msg="Axis options are not contains in select box")
        self.data.page_loading(self.driver)
        print("checking with graph values ")
        self.logger.info("test_crc_graph is completed...")

    def test_clusterlevel_homeicon(self):
        self.tests.pop()
        self.logger.info("test_clusterlevel_homeicon" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = click_on_home(self.driver)
        result = b.test_homeicon()
        if "crc-report" in self.driver.current_url:
            print("crc home page is loaded")
        else:
            print("crc home page is not loaded")
        self.logger.info("test_clusterlevel_homeicon is completed...")


    def test_on_clusterlevel_to_hyperlinks(self):
        self.tests.pop()
        self.logger.info("test_on_clusterlevel_to_hyperlinks" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = click_on_hyperlinks(self.driver)
        result = b.test_hyperlink()
        print("checking hyper link is working or not ")
        self.logger.info("test_on_clusterlevel_to_hyperlinks is completed...")


    def test_download_blockwise_csv(self):
        self.tests.pop()
        self.logger.info("test_download_blockwise_csv" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = donwload_blockwise_csv(self.driver)
        result = b.test_blockwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_file()
        print("Districtwise csv files are downloaded")
        self.logger.info("test_download_blockwise_csv is completed...")

    def test_donwoad_clusterwise_csv(self):
        self.tests.pop()
        self.logger.info("test_donwoad_clusterwise_csv" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = load_clusterwise_csv(self.driver)
        result = b.test_clusterwise()
        self.assertTrue(result, msg = "File is not downloaded")
        b.remove_file()
        print("cluster level csv files are downloaded..")
        self.logger.info("test_donwoad_clusterwise_csv is completed...")

    def test_visited(self):
        self.tests.pop()
        self.logger.info("test_visited" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =visited(self.driver)
        result1,result2 = b.test_schools()
        self.assertEqual(int(result1),result2, msg="total no of visited are mismatching in district level")
        b.remove_file()
        print("comparing visited footer values with downloaded csv files")
        self.logger.info("test_visited is completed...")

    def test_visits(self):
        self.tests.pop()
        self.logger.info("test_visits" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =school_visits(self.driver)
        res1 ,res2  =b.test_visits()
        self.assertEqual(int(res1),res2, msg="total no of visits are mismatching in district level")
        b.remove_file()
        print("comparing visits footer values with downloaded csv files")
        self.logger.info("test_visits is completed...")

    def test_schoolcount(self):
        self.tests.pop()
        self.logger.info("test_schoolcount" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = school_count(self.driver)
        res1, res2 = b.test_schools()
        self.assertEqual(int(res1), res2, msg="total no of school are mismatching in district level")
        b.remove_csv()
        print("comparing school  footer values with downloaded csv files")
        self.logger.info("test_schoolcount is completed...")

    def test_download_districtwise(self):
        self.tests.pop()
        self.logger.info("test_download_districtwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = Districtwise_donwload(self.driver)
        result  = b.test_districtwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_csv()
        print("District csv file is downloaded..")
        self.logger.info("test_download_districtwise is completed...")


    def test_logout(self):
        self.tests.pop()
        self.logger.info("test_logout" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = Logout_function(self.driver)
        res = b.test_logout()
        if "crc-report" in self.driver.current_url:
            print("Navigated back to crc report")
        else:
            print("CRC report is not loaded ")
        time.sleep(2)
        self.logger.info("test_logout is completed...")


    def test_navigate_crc(self):
        self.tests.pop()
        self.logger.info("test_navigate_crc" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =loading_crc(self.driver)
        res = b.test_crc()
        if "crc-report" in self.driver.current_url:
            print("Navigated back to crc report")
        else:
            print("CRC report is not loaded ")
        time.sleep(2)
        self.logger.info("test_navigate_crc is completed...")

    def test_dash_menu(self):
        self.tests.pop()
        self.logger.info("test_dash_menu" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b =Dashboard_menu(self.driver)
        res = b.test_dashboard()
        self.assertEqual(res,"menu",msg="Dashboard button is not working")
        print("checking dashboard is working or not..")
        self.logger.info("test_dash_menu is completed...")



    def test_blockwise_graph(self):
        self.tests.pop()
        self.logger.info("test_blockwise_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = Blockwise_graph(self.driver)
        res = b.test_blockwise_graph()
        if "myChart" in self.driver.page_source:
            print("CRC Scattor plot is working fine")
        else:
            print("CRC plot is not exist..")
        self.data.page_loading(self.driver)
        self.logger.info("test_blockwise_graph is completed...")

    def test_clusterwise_graph(self):
        self.tests.pop()
        self.logger.info("test_clusterwise_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = cluster_graph(self.driver)
        res = b.test_clusterwise_graph()
        if "myChart" in self.driver.page_source:
            print("CRC Scattor plot is working fine")
        else:
            print("CRC plot is not exist..")
        self.data.page_loading(self.driver)
        self.logger.info("test_clusterwise_graph is completed...")

    def test_districtwise_schoolsvisited(self):
        self.tests.pop()
        self.logger.info("test_districtwise_schoolsvisited" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = districtwise_visits(self.driver)
        result = b.test_districtwise_schoolvisited()
        self.data.page_loading(self.driver)
        print("checking districtwise school visited footer with downloaded csv files")
        self.logger.info("test_districtwise_schoolsvisited is completed...")

    def test_crc_blockwise(self):
        self.tests.pop()
        self.logger.info("test_crc_blockwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = crc_blockwise_records(self.driver)
        result = b.test_blockwise()
        print("checked with blockwise records")
        self.assertNotEqual(0, result, msg="Table data is not loaded ")
        print("checking blockwise school visited footer with downloaded csv files")
        self.logger.info("test_crc_blockwise is completed...")
    @classmethod
    def tearDownClass(cls):
        cls.driver.close()













































































