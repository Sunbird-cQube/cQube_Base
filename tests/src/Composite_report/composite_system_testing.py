



import unittest

from Composite_report.check_clusterwise_records import composite_schoolevel_records
from Composite_report.click_on_block_cluster_school_buttons import Blocks_cluster_schools_Buttons
from Composite_report.download_blockwise_csv import download_blockwise_csv
from Composite_report.download_clusterwise_csv import download_clusterwise_csv
from Composite_report.download_districtwise_csv import Districtwise_download
from Composite_report.download_schoolwise_csv import school_wise_download
from Data.parameters import Data
from reuse_func import GetData


class composite_system_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(50)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_composite_report()
        self.data.page_loading(self.driver)

    #
    def test_composite_icon(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print("Landing page is displayed ")
        else:
            print('Home button is not working ')
            count = count + 1
        self.assertEqual(0,count,msg="Home btn is not working ")
        self.driver.find_element_by_id('composite').click()
        self.data.page_loading(self.driver)

    def test_districtwise_csv_download(self):
        b = Districtwise_download(self.driver)
        res = b.test_districtwise()
        self.assertTrue(res, msg="Districtwise csv file is not downloaded ")
        print("Checked district wise csv downloading functionality is working ")
        b.remove_csv()
        self.data.page_loading(self.driver)

    def test_blockwise_csv_download(self):
        b = download_blockwise_csv(self.driver)
        res = b.test_blockwise()
        self.assertTrue(res, msg="Blockwise csv file is not downloaded ")
        print("Checked block wise csv downloading functionality is working ")
        b.remove_file()
        self.data.page_loading(self.driver)

    def test_clusterwise_csv_download(self):
        b = download_clusterwise_csv(self.driver)
        res = b.test_clusterwise()
        self.assertTrue(res, msg="Clusterwise csv file is not downloaded ")
        print("Checked cluster wise csv downloading functionality is working ")
        b.remove_file()
        self.data.page_loading(self.driver)

    def test_school_wise_download(self):
        b = school_wise_download(self.driver)
        res = b.test_schoolwise()
        self.assertTrue(res, msg="Schoolwise csv file is not downloaded ")
        print("Checked school wise csv downloading functionality is working ")
        b.remove_file()
        self.data.page_loading(self.driver)

    def test_composite_schoolwise_records(self):
        b = composite_schoolevel_records(self.driver)
        res = b.check_csv_download()
        self.assertTrue(res, msg="Some of school csv file is not downloaded ")
        print("Checked with School wise csv file downloading ")
        self.data.page_loading(self.driver)



    def test_blocks_clusters_schools(self):
        b = Blocks_cluster_schools_Buttons(self.driver)
        res = b.click_on_blocks_button()
        self.assertEqual(0, res, msg="Blocks graph is displayed ")
        print("Block wise graph is displayed ")
        self.data.page_loading(self.driver)

        b = Blocks_cluster_schools_Buttons(self.driver)
        res = b.click_on_clusters_button()
        self.assertEqual(0, res, msg="Cluster graph is displayed ")
        print("Cluster wise graph is displayed ")
        self.data.page_loading(self.driver)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
