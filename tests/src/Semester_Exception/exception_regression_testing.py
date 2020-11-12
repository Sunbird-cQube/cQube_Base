import time
import unittest
from Data.parameters import Data

from Semester_Exception.Click_on_hyper_link_in_semester_report import sem_exception_hyperlink
from Semester_Exception.check_cluster_per_block_csv_download import ClusterPerBlockCsvDownload
from Semester_Exception.check_districts_csv_download import DistrictwiseDownload
from Semester_Exception.check_with_notrecieved_records import Data_not_recieved
from Semester_Exception.click_on_Home_icon import exception_Home

from Semester_Exception.click_on_blocks import Semester_Blocks
from Semester_Exception.click_on_clusters import semester_clusters
from Semester_Exception.click_on_dashboard import sem_dashboard
from Semester_Exception.click_on_schools import semeste_schools
from Semester_Exception.click_on_semester_report_and_logout import sem_exception_Logout

from Semester_Exception.download_districtwise_csv import check_DistrictwiseCsv

from reuse_func import GetData


class cQube_semester_exception_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_semester_exception()
            self.data.page_loading(self.driver)

    def test_sem_dashboard(self):
        b = sem_dashboard(self.driver)
        res = b.test_click_on_dashboard()
        self.assertEqual(0, res, msg='Dashboard button is not working ')

    def test_Data_not_recieved(self):
        b = Data_not_recieved(self.driver)
        res, r1, r2, r3 = b.test_total_not_recieved_data()
        self.assertEqual(res, r1, msg='Block level data not recieved count mismatch found')
        self.assertEqual(res, r2, msg='cluster level data not recieved count mismatch found')
        self.assertEqual(res, r3, msg='School level data not recieved count mismatch found')

    def test_Semester_Blocks(self):
        b = Semester_Blocks(self.driver)
        res = b.check_markers_on_block_map()
        self.assertNotEqual(0,res,msg="markers are not present on block level map")

    def test_semester_clusters(self):
        b = semester_clusters(self.driver)
        res = b.check_markers_on_clusters_map()
        self.assertNotEqual(0,res,msg="markers are not present on cluster level map")

    def test_semesterschool(self):
        b = semeste_schools(self.driver)
        res = b.check_markers_on_school_map()
        self.assertNotEqual(0,res,msg="markers are not present on cluster level map")

    def test_DistrictwiseDownload(self):
        b = DistrictwiseDownload(self.driver)
        res = b.check_districts_csv_download()
        self.assertEqual(0,res,msg="Some district level csv file is not downloaded")

    def test_homepage(self):
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.data.navigate_to_semester_exception()
        count = 0
        self.data.page_loading(self.driver)
        if 'sem-exception' in self.driver.current_url:
            print("Home page of sem exception is present ")
        else:
            print('home page does not exist')
            count = count + 1
        self.assertEqual(0, count, msg='Home page not exists')

    def test_check_DistrictwiseCsv(self):
        b = check_DistrictwiseCsv(self.driver)
        res = b.click_download_csv_of_districts()
        self.assertEqual(0,res,msg='mis match found at footer information')
        self.data.page_loading(self.driver)


    def test_exception_Home(self):
        b = exception_Home(self.driver)
        res = b.click_on_blocks_click_on_home_icon()
        self.assertEqual(0,res , msg="Home button is not working")


    def test_ClusterPerBlockCsvDownload(self):
        b = ClusterPerBlockCsvDownload(self.driver)
        res = b.check_csv_download()
        self.assertEqual(0,res , msg='Some cluster level files are not downloaded')

    def test_sem_exception_Logout(self):
        b = sem_exception_Logout(self.driver)
        res = b.click_on_logout()
        self.assertEqual(res, 'Log in to cQube', msg="logout button is not working")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_exception()
        self.data.page_loading(self.driver)
        time.sleep(3)

    def test_sem_exception_hyperlink(self):
        b = sem_exception_hyperlink(self.driver)
        result1, result2, choose_dist = b.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()