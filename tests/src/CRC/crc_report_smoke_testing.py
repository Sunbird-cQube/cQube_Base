
import time
import unittest

from CRC.check_crc_block_per_district_csv_download import blockwise
from CRC.check_crc_tabledata_by_districtwise import schoolwise_tabledata
from CRC.check_homebtn import Homeicon
from CRC.check_table_data_order import Check_order_of_tabledata

from CRC.check_total_no_of_visited_in_districtwise import visited
from CRC.check_total_no_of_visits_in_districtwise import school_visits
from CRC.check_totalschools_count_in_districtwise import school_count
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
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_crc_report()
            self.data.page_loading(self.driver)

    def test_logout(self):
        b = Logout_function(self.driver)
        res = b.test_logout()
        if "crc-report" in self.driver.current_url:
            print("Navigated back to crc report")
        else:
            print("CRC report is not loaded ")
        time.sleep(2)

    def test_navigate_crc(self):
        b =loading_crc(self.driver)
        res = b.test_crc()
        if "crc-report" in self.driver.current_url:
            print("Navigated back to crc report")
        else:
            print("CRC report is not loaded ")
        self.data.page_loading(self.driver)

    def test_dash_menu(self):
        print("check with dashboard menu")
        b = Dashboard_menu(self.driver)
        res = b.test_dashboard()
        self.assertEqual(res, "menu", msg="Dashboard button is not working")

    def test_download_blockwise_csv(self):
        print("download blockwise csv file")
        b = donwload_blockwise_csv(self.driver)
        result = b.test_blockwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_file()

    def test_download_clusterwise_csv(self):
        print("download clusterwise csv file")
        b = load_clusterwise_csv(self.driver)
        result = b.test_clusterwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_file()

    def test_visited(self):
        print("comapre visited footer value with downloaded csv file values")
        b = visited(self.driver)
        result1, result2 = b.test_schools()
        self.assertEqual(int(result1), result2, msg="total no of visited are mismatching in district level")
        b.remove_file()

    def test_visits(self):
        print("comapre visits footer value with downloaded csv file values")
        b =school_visits(self.driver)
        res1 ,res2  =b.test_visits()
        self.assertEqual(int(res1),res2, msg="total no of visits are mismatching in district level")
        b.remove_file()

    def test_schoolcount(self):
        print("comapre school count footer value with downloaded csv file values")
        b = school_count(self.driver)
        res1, res2 = b.test_schools()
        self.assertEqual(int(res1), res2, msg="total no of school are mismatching in district level")
        b.remove_csv()

    def test_orderwise_tabledata(self):
        print("checking order of table records")
        b = Check_order_of_tabledata(self.driver)
        result = b.test_order()
        self.assertEqual(result, "menu", msg="Menu is not exist")

    def test_download_districtwise(self):
        print("downloads districtwise csv file")
        b = Districtwise_donwload(self.driver)
        result = b.test_districtwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_csv()

    def test_table_data(self):
        print("check districtwise table records present or not ")
        b = schoolwise_tabledata(self.driver)
        result = b.test_table_data()
        self.assertNotEqual(0, result, "Data not found on table")

    def test_blockwise_data(self):
        print("check with blockwise records")
        b = blockwise(self.driver)
        result = b.test_blocklevel()
        self.assertEqual(0, result, msg="some district files are not downloaded")

    def test_homeicon(self):
        print("check home button is working or not")
        b=Homeicon(self.driver)
        result = b.test_homeicon()
        self.assertTrue(result,msg="Home button not working ")

    def test_download_blockwise(self):
        print("checking performance of blockwise csv file download")
        b = donwload_blockwise_csv(self.driver)
        result = b.test_blockwise()
        self.assertTrue(result, msg="Blockwise csv is not downloaded")
        print("Block wise csv file is downloaded within 10 seconds")
        b.remove_file()

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()