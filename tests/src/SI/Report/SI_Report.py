import time
import unittest

from selenium.common import exceptions

from SI.Report.Click_on_xaxis_and_yaxis import Graph_values
from SI.Report.check_block_per_district_csv_download import blocklevel_csv
from SI.Report.check_cluster_per_block_report_csv_download import clusterlevel_csv
from SI.Report.check_graph_present_on_school_infra import check_with_graph
from SI.Report.check_homebtn import home_button

from SI.Report.check_school_per_cluster_csv_download import School_per_csv
from SI.Report.check_table_data_metrics import download_report
from SI.Report.check_table_present_on_schoolinfra import check_with_table
from SI.Report.check_tabledata_by_select_district_block_and_cluster import clusterwise_tabledata
from SI.Report.check_tabledata_by_selecting_district_and_block import blockwise_tabledata

from SI.Report.check_tabledata_by_selecting_districts import districtwise_tabledata
from SI.Report.check_with_hyperlink import Hyperlink
from SI.Report.click_on_Report_from_scinfra import check_schoolinfra_report
from SI.Report.click_on_district_and_click_download import download_districtwise
from SI.Report.click_on_district_block_cluster_home import check_home

from SI.Report.click_on_table_and_check_with_orderof_values import check_order_of_tabledata
from SI.Report.download_blockwise_csv import donwload_blockwise_csv
from SI.Report.download_clusterwise_csv import donwload_clusterwise_csv
from SI.Report.download_districtwise_csv import download_district_wise_csv
from SI.Report.download_schoolwise_csv import school_wise_donwload

from SI.Report.navigate_to_SI_report import si_report
from SI.Report.navigate_to_dashboard import check_dashboard
from SI.Report.navigate_to_schoolinfra_and_click_on_logout import schoolinfra_logout

from reuse_func import GetData


class cQube_SI_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    def test_blockwise_from_selectbox(self):
        b =blocklevel_csv(self.driver)
        res = b.test_each_district()
        self.assertEqual(0,res,msg="some files are not downloaded")

    def test_clusterwise_from_selectbox(self):
        b = clusterlevel_csv(self.driver)
        res = b.test_search()
        self.assertEqual(0, res, msg="some blockwise are not downloaded")

    def test_graph(self):
        b = check_with_graph(self.driver)
        res = b.test_graph()
        self.assertIn("myChart", self.driver.page_source, msg="Does not exist")

    def test_home(self):
        b =home_button(self.driver)
        res = b.test_home()
        self.assertTrue(res, msg = "Home button not working ")

    def test_shoolwise_csv(self):
        b =School_per_csv(self.driver)
        res = b.test_search()
        self.assertEqual(0, res, msg="Some schoolwise are not present ")

    def test_downloadreportwise(self):
        b =download_report(self.driver)
        path =b.test_schools()
        self.assertTrue(path, msg="File is not downloaded")
        b.remove_csv()

    def test_check_hyperlinks(self):
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District ":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")
        time.sleep(5)

    def test_tabledata(self):
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

    # def test_tabledata_clusterwise(self):
    #     b = clusterwise_tabledata(self.driver)
    #     res = b.test_table_data()
    #     if res != 0:
    #         raise self.failureException('Data not found on table')

    def test_tabledata_blockwise(self):
        b =blockwise_tabledata(self.driver)
        res = b.test_table_data()
        if res != 0:
            raise self.failureException('Data not found on table')

    def test_tabledata_districtwise(self):
        b =districtwise_tabledata(self.driver)
        res = b.test_table_data()
        if res != 0:
            raise self.failureException('Data not found on table')

    def test_districtwise_csv(self):
        b = download_districtwise(self.driver)
        res = b.test_donwload()
        self.assertTrue(res,msg="districtwise file is not downloaded")
        b.remove_csv()
        self.data.page_loading(self.driver)

    def test_cluster_home(self):
        b = check_home(self.driver)
        self.data.page_loading(self.driver)
        res = b.test_home()
        if "school-infrastructure" in self.driver.current_url:
            print("School infra report page")
        else:
            print("school infra page not loaded")
        self.data.page_loading(self.driver)

    def test_donwload_options(self):
        b =Hyperlink(self.driver)
        res = b.click_on_hyperlinks()


    def test_school_report(self):
        b=check_schoolinfra_report(self.driver)
        res = b.test_report()
        self.assertEqual("menu",res,msg="Dashboard is not exists!")

    def test_check_orderwise(self):
        b =check_order_of_tabledata(self.driver)
        print("Table record order wise..")
        res = b.test_tablevalue()

    def test_plotvalue(self):
        b =Graph_values(self.driver)
        res = b.test_plots()

    def test_donwload_blockwise(self):
        b = donwload_blockwise_csv(self.driver)
        res =b.test_block()
        self.assertTrue(res, msg = "File is not downloaded")
        b.remove_csv()
        self.data.page_loading(self.driver)

    # def test_donwload_clusterwise(self):
    #     b = donwload_clusterwise_csv(self.driver)
    #     res = b.test_clusterwise()
    #     self.assertTrue(res, msg="File is not downloaded")
    #     b.remove_csv()

    def test_schoolwise_donwload(self):
        b = school_wise_donwload(self.driver)
        res = b.test_schoolwise()
        self.assertTrue(res, msg="File is not downloaded")
        b.remove_csv()

    def test_download_districtwise(self):
        b = download_district_wise_csv(self.driver)
        res = b.test_districtwise()
        self.assertTrue(res, msg = "File is not downloaded")
        b.remove_file()

    def test_schoolreport(self):
        b = si_report(self.driver)
        res =b.test_url()
        self.assertNotIn(" School infrastructure for: ",self.driver.page_source,msg="School infrastructure report not exist ")

    def test_dashboard(self):
        b =check_dashboard(self.driver)
        res =b.test_menulist()

    def test_logout(self):
        b=schoolinfra_logout(self.driver)
        res = b.test_logout()
        self.assertNotIn(" School Infrastructure report for: ",self.driver.page_source,msg="School infrastructure report not exist ")
        self.assertEqual("cQube",self.driver.title,msg="logout is not working ")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
