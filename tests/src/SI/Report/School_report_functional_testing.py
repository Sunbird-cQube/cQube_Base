import time
import unittest

from selenium.common import exceptions

from SI.Report.Click_on_xaxis_and_yaxis import Graph_values
from SI.Report.check_block_per_district_csv_download import blocklevel_csv
from SI.Report.check_blockwise_graph import blockwise_graph
from SI.Report.check_clusterwise_graph import clusterwise_graph
from SI.Report.check_districtwise_graph import districtwise_graph
from SI.Report.check_graph_present_on_school_infra import check_with_graph
from SI.Report.check_homebtn import home_button

from SI.Report.check_table_data_metrics import download_report
from SI.Report.check_table_present_on_schoolinfra import check_with_table

from SI.Report.check_tabledata_by_selecting_districts import districtwise_tabledata
from SI.Report.check_with_hyperlink import Hyperlink
from SI.Report.click_on_Report_from_scinfra import check_schoolinfra_report
from SI.Report.click_on_district_and_click_download import download_districtwise
from SI.Report.click_on_district_block_cluster_home import check_home

from SI.Report.click_on_table_and_check_with_orderof_values import check_order_of_tabledata
from SI.Report.download_blockwise_csv import donwload_blockwise_csv
from SI.Report.download_districtwise_csv import download_district_wise_csv

from SI.Report.navigate_to_SI_report import si_report
from SI.Report.navigate_to_dashboard import check_dashboard
from SI.Report.navigate_to_schoolinfra_and_click_on_logout import schoolinfra_logout

from reuse_func import GetData


class cQube_SI_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 23
        self.tests = [0] * 24
        self.data = GetData()
        self.logger = self.data.get_functional_log("schoolinfrareport")
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    def test_blockwise_from_selectbox(self):
        self.tests.pop()
        self.logger.info("test_blockwise_from_selectbox" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("check blockwise records..")
        b =blocklevel_csv(self.driver)
        res = b.test_each_district()
        self.assertEqual(0,res,msg="some files are not downloaded")
        self.logger.info("test_blockwise_from_selectbox is completed...")

    def test_graph(self):
        self.tests.pop()
        self.logger.info("test_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("check graph functinality")
        b = check_with_graph(self.driver)
        res = b.test_graph()
        self.assertIn("myChart", self.driver.page_source, msg="Does not exist")
        self.logger.info("test_graph is completed...")

    def test_home(self):
        self.tests.pop()
        self.logger.info("test_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("check home button is working or not")
        b =home_button(self.driver)
        res = b.test_home()
        self.assertTrue(res, msg = "Home button not working ")

    def test_download_district_wise(self):
        self.tests.pop()
        self.logger.info("test_downloadreportwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("downloading districtwise csv file")
        b =download_report(self.driver)
        path =b.test_schools()
        self.assertTrue(path, msg="File is not downloaded")
        b.remove_csv()
        self.logger.info("test_downloadreportwise is completed...")


    def test_check_hyperlinks(self):
        self.tests.pop()
        self.logger.info("test_check_hyperlinks" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("check with hyperlinks")
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District ":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")
        self.data.page_loading(self.driver)
        self.logger.info("test_check_hyperlinks is completed...")

    def test_tabledata(self):
        self.tests.pop()
        self.logger.info("test_tabledata" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking table contains records or not")
        b = check_with_table(self.driver)
        res = b.test_graph_and_table_present_on_school_infra()
        try:
            tablehead = self.driver.find_element_by_tag_name("table")
            self.data.page_loading(self.driver)
            return tablehead.is_displayed()
        except exceptions.NoSuchElementException:
            print("Table is present ")
        self.assertTrue(res,msg="Table is not exist")
        self.data.page_loading(self.driver)
        self.logger.info("test_tabledata is completed...")



    def test_tabledata_districtwise(self):
        self.tests.pop()
        self.logger.info("test_tabledata_districtwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("districtwise table records..")
        b =districtwise_tabledata(self.driver)
        res = b.test_table_data()
        if res != 0:
            raise self.failureException('Data not found on table')
        self.logger.info("test_tabledata_districtwise is completed...")

    def test_districtwise_csv(self):
        self.tests.pop()
        self.logger.info("test_districtwise_csv" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("districtwise csv file downloading..")
        b = download_districtwise(self.driver)
        res = b.test_donwload()
        self.assertTrue(res,msg="districtwise file is not downloaded")
        b.remove_csv()
        self.logger.info("test_districtwise_csv is completed...")

        time.sleep(3)

    def test_cluster_home(self):
        self.tests.pop()
        self.logger.info("test_cluster_home" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("going to cluster level and clicking on home icon")
        b = check_home(self.driver)
        self.data.page_loading(self.driver)
        res = b.test_home()
        if "school-infrastructure" in self.driver.current_url:
            print("School infra report page")
        else:
            print("school infra page not loaded")
        time.sleep(2)
        self.logger.info("test_cluster_home is completed...")


    def test_donwload_options(self):
        self.tests.pop()
        self.logger.info("test_donwload_options" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("download report select box contais options or not")
        b =Hyperlink(self.driver)
        res = b.click_on_hyperlinks()
        self.logger.info("test_donwload_options is completed...")



    def test_school_report(self):
        self.tests.pop()
        self.logger.info("test_school_report" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("school wise records validation ")
        b=check_schoolinfra_report(self.driver)
        res = b.test_report()
        self.assertEqual("menu",res,msg="Dashboard is not exists!")
        self.logger.info("test_school_report is completed...")


    def test_check_orderwise(self):
        self.tests.pop()
        self.logger.info("test_check_orderwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("check order of table records..")
        b =check_order_of_tabledata(self.driver)
        print("Table record order wise..")
        res = b.test_tablevalue()
        self.logger.info("test_check_orderwise is completed...")


    def test_plotvalue(self):
        self.tests.pop()
        self.logger.info("test_plotvalue" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking x and y axis values")
        b =Graph_values(self.driver)
        res = b.test_plots()
        self.logger.info("test_plotvalue is completed...")


    def test_donwload_blockwise(self):
        self.tests.pop()
        self.logger.info("test_donwload_blockwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("Downloading blockwise csv file")
        b = donwload_blockwise_csv(self.driver)
        res =b.test_block()
        self.assertTrue(res, msg = "File is not downloaded")
        b.remove_csv()
        self.logger.info("test_donwload_blockwise is completed...")
        self.data.page_loading(self.driver)

    def test_download_districtwise(self):
        self.tests.pop()
        self.logger.info("test_download_districtwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("Downloading Districtwise csv file")
        b = download_district_wise_csv(self.driver)
        res = b.test_districtwise()
        self.assertTrue(res, msg = "File is not downloaded")
        b.remove_file()
        self.logger.info("test_download_districtwise is completed...")


    def test_schoolreport(self):
        self.tests.pop()
        self.logger.info("test_schoolreport" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("school infrastructure report options in dashboard ")
        b = si_report(self.driver)
        res =b.test_url()
        self.assertNotIn(" School infrastructure for: ",self.driver.page_source,msg="School infrastructure report not exist ")
        self.logger.info("test_schoolreport is completed...")

    def test_dashboard(self):
        self.tests.pop()
        self.logger.info("test_dashboard" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("check with dashboard")
        b =check_dashboard(self.driver)
        res =b.test_menulist()
        self.logger.info("test_dashboard is completed...")

    def test_logout(self):
        self.tests.pop()
        self.logger.info("test_logout" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking logout functionality is working or not ")
        b=schoolinfra_logout(self.driver)
        res = b.test_logout()
        self.assertNotIn(" School Infrastructure report for: ",self.driver.page_source,msg="School infrastructure report not exist ")
        self.assertEqual("Log in to cQube",self.driver.title,msg="logout is not working ")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.logger.info("test_logout is completed...")
        self.data.page_loading(self.driver)

    def test_districtwise_graph(self):
        self.tests.pop()
        self.logger.info("test_districtwise_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = districtwise_graph(self.driver)
        res = b.test_districtwise_graph()
        if "myChart" in self.driver.page_source:
            print("School infra Scattor plot is working fine")
        else:
            print("School infra plot is not exist..")
        self.data.page_loading(self.driver)
        self.logger.info("test_districtwise_graph is completed...")


    def test_blockwise_graph(self):
        self.tests.pop()
        self.logger.info("test_blockwise_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = blockwise_graph(self.driver)
        res = b.test_blockwise_graph()
        if "myChart" in self.driver.page_source:
            print("School infra Scattor plot is working fine")
        else:
            print("School infra plot is not exist..")
        self.data.page_loading(self.driver)
        self.logger.info("test_blockwise_graph is completed...")


    def test_clusterwise_graph(self):
        self.tests.pop()
        self.logger.info("test_clusterwise_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = clusterwise_graph(self.driver)
        res = b.test_clusterwise_graph()
        if "myChart" in self.driver.page_source:
            print("school infra Scattor plot is working fine")
        else:
            print("School infra plot plot is not exist..")
        self.data.page_loading(self.driver)
        self.logger.info("test_clusterwise_graph is completed...")


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
