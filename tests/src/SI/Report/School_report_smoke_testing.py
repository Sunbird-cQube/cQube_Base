import time
import unittest

from selenium.common import exceptions

from SI.Report.check_block_per_district_csv_download import blocklevel_csv
from SI.Report.check_graph_present_on_school_infra import check_with_graph
from SI.Report.check_homebtn import home_button
from SI.Report.check_table_data_metrics import download_report
from SI.Report.check_table_present_on_schoolinfra import check_with_table

from SI.Report.check_with_hyperlink import Hyperlink
from SI.Report.click_on_district_block_cluster_home import check_home
from SI.Report.click_on_table_and_check_with_orderof_values import check_order_of_tabledata
from SI.Report.navigate_to_SI_report import si_report
from SI.Report.navigate_to_schoolinfra_and_click_on_logout import schoolinfra_logout

from reuse_func import GetData


class cQube_SI_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 10
        self.tests = [0] * 11
        self.data = GetData()
        self.logger = self.data.get_smoke_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        time.sleep(5)

    def test_graph(self):
        self.tests.pop()
        self.logger.info("test_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking with graph functionality")
        b = check_with_graph(self.driver)
        res = b.test_graph()
        self.assertIn("myChart", self.driver.page_source, msg="Does not exist")
        self.logger.info("test_graph is completed...")

    def test_home(self):
        self.tests.pop()
        self.logger.info("test_graph" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking home icon functionality")
        b = home_button(self.driver)
        res = b.test_home()
        self.assertTrue(res, msg="Home button not working ")

    def test_download_district_wise(self):
        self.tests.pop()
        self.logger.info("test_downloadreportwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("download districtwise csv file")
        b = download_report(self.driver)
        path = b.test_schools()
        self.assertTrue(path, msg="File is not downloaded")
        b.remove_csv()
        self.logger.info("test_downloadreportwise is completed...")

    def test_check_hyperlinks(self):
        self.tests.pop()
        self.logger.info("test_check_hyperlinks" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District ":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")
        self.data.page_loading(self.driver)
        self.logger.info("test_check_hyperlinks is completed...")

    def test_schoolreport(self):
        self.tests.pop()
        self.logger.info("test_schoolreport" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("school infrastructure report")
        b = si_report(self.driver)
        res =b.test_url()
        self.assertNotIn(" School infrastructure for: ",self.driver.page_source,msg="School infrastructure report not exist ")
        self.logger.info("test_schoolreport is completed...")


    def test_tabledata(self):
        self.tests.pop()
        self.logger.info("test_tabledata" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking with table records")
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

    def test_cluster_home(self):
        self.tests.pop()
        self.logger.info("test_cluster_home" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = check_home(self.driver)
        self.data.page_loading(self.driver)
        res = b.test_home()
        if "school-infrastructure" in self.driver.current_url:
            print("School infra report page")
        else:
            print("school infra page not loaded")
        self.data.page_loading(self.driver)
        self.logger.info("test_cluster_home is completed...")

    def test_check_orderwise(self):
        self.tests.pop()
        self.logger.info("test_check_orderwise" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking table records order")
        b = check_order_of_tabledata(self.driver)
        print("Table record order wise..")
        res = b.test_tablevalue()
        self.logger.info("test_check_orderwise is completed...")

    def test_blockwise_from_selectbox(self):
        self.tests.pop()
        self.logger.info("test_blockwise_from_selectbox" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("choosing blocks from select box ")
        b = blocklevel_csv(self.driver)
        res = b.test_each_district()
        self.assertEqual(0, res, msg="some files are not downloaded")
        self.logger.info("test_blockwise_from_selectbox is completed...")

    def test_logout(self):
        self.tests.pop()
        self.logger.info("test_logout" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        print("checking logout functionality")
        b = schoolinfra_logout(self.driver)
        res = b.test_logout()
        self.assertNotIn(" School Infrastructure report for: ", self.driver.page_source,
                         msg="School infrastructure report not exist ")
        self.assertEqual("Log in to cQube", self.driver.title, msg="logout is not working ")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.logger.info("test_logout is completed...")
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()