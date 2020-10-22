import unittest
from reuse_func import GetData

from CRC.check_clusterwise_records import crc_schoolevel_records
from CRC.check_crc_tabledata_by_selecting_districts import districtwise_tabledata
from CRC.check_xaxis_and_yaxis_from_selectbox import plot_values
from CRC.download_blockwise_csv import donwload_blockwise_csv
from CRC.download_clusterwise_csv import load_clusterwise_csv

from CRC.download_districtwise_csv import Districtwise_donwload
from CRC.download_schoolwise_csv import school_wise_download
from CRC.navigate_to_dashboard import Dashboard_menu



class crc_System_Testing(unittest.TestCase):
    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(100)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_crc_report()
            self.data.page_loading(self.driver)

    def test_dash_menu(self):
        b = Dashboard_menu(self.driver)
        res = b.test_dashboard()
        self.assertEqual(res, "menu", msg="Dashboard button is not working")
        print("Dashboard icon is working....")
        self.data.page_loading(self.driver)

    def test_download_districtwise(self):
        b = Districtwise_donwload(self.driver)
        result = b.test_districtwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_csv()
        print("district wise csv file is downloaded ")
        self.data.page_loading(self.driver)

    def test_download_blockwise_csv(self):
        b = donwload_blockwise_csv(self.driver)
        result = b.test_blockwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_file()
        print("blockwise csv file is downloaded ")
        self.data.page_loading(self.driver)

    def test_donwoad_clusterwise_csv(self):
        b = load_clusterwise_csv(self.driver)
        result = b.test_clusterwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_file()
        print("cluster wise csv file is downloaded ")
        self.data.page_loading(self.driver)

    def test_download_schoolwise(self):
        b = school_wise_download(self.driver)
        result = b.test_schoolwise()
        self.assertTrue(result, msg="File is not downloaded")
        b.remove_file()
        print("district wise csv file is downloaded ")
        self.data.page_loading(self.driver)

    def test_crc_clusterwise(self):
        b = crc_schoolevel_records(self.driver)
        res = b.check_csv_download()
        print("Clusterwise records checking ")
        self.assertEqual(0,res,msg='Some of clusterwise records mismatch found! ')
        self.data.page_loading(self.driver)

    def test_districtwise_tabledata(self):
        b = districtwise_tabledata(self.driver)
        result = b.test_table_data()
        if result != 0:
            raise self.failureException('Data not found on table')
        print("checked with districtwise table data")
        self.data.page_loading(self.driver)


    def test_crc_graph(self):
        b = plot_values(self.driver)
        res1, res2 = b.test_plots()
        self.assertNotEqual(0, res1, msg="x Axis options are not contains in select box")
        self.assertNotEqual(0, res2, msg="y axis options are not present in drop down")
        self.data.page_loading(self.driver)
        print("checked graph x and y axis options")


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()













































































