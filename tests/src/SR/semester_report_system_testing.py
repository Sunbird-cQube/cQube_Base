import time
import unittest

from SR.check_semester_choose_district import District
from SR.check_semester_choose_district_block import DistrictsBlock
from SR.check_semester_choose_district_block_cluster import DistrictBlockCluster
from SR.download_blockwise_csv import BlockwiseCsv
from SR.download_clusterwise_csv import ClusterwiseCsv
from SR.download_districtwise_csv import DistrictwiseCsv
from SR.download_schoolwise_csv import SchoolwiseCsv
from SR.semester_options import Semester_options

from reuse_func import GetData


class cQube_Semester_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        time.sleep(5)

    def test_sem_options(self):
        b =Semester_options(self.driver)
        res1,res2 = b.test_semester_option()
        self.assertEqual(0,res1,msg="Semester 1 is selected ")
        print('Semester 2 is working ')
        self.assertNotEqual(0,res2,msg="Markers are missing on semeter2 map ")
        self.data.page_loading(self.driver)

    def test_districtwise_csv_download(self):
        csv = DistrictwiseCsv(self.driver)
        result = csv.click_download_icon_of_district()
        if result == "File Not Downloaded":
            raise self.failureException(result)

    def test_blockwise_csv_download(self):
        csv = BlockwiseCsv(self.driver)
        result = csv.click_download_icon_of_blocks()
        if result == "File Not Downloaded":
            raise self.failureException(result)

    def test_clusterwise_csv_download(self):
        csv = ClusterwiseCsv(self.driver)
        result = csv.click_download_icon_of_clusters()
        if result == "File Not Downloaded":
            raise self.failureException(result)

    def test_schoolwise_cv_download(self):
        csv = SchoolwiseCsv(self.driver)
        result = csv.click_download_icon_of_schools()
        if result == "File Not Downloaded":
            raise self.failureException(result)

    def test_choose_district_block_cluster(self):
        dist = District(self.driver)
        result = dist.check_district()
        if result == 0:
            print("Block per district csv report download is working")
            print("on selection of each district")
            print("The footer value of no of schools and no of students are")
            print("equals to downloaded file")
        else:
            raise self.failureException("Block per district csv report download is not working")
        block = DistrictsBlock(self.driver)
        result = block.check_districts_block()
        if result == 0:
            print("Cluster per block csv report download is working")
            print("on selection of each district and block")
            print("The footer value of no of schools and no of students are")
            print("equals to downloaded file")
        else:
            raise self.failureException("Cluster per block csv report download not is working")
        schools = DistrictBlockCluster(self.driver)
        result = schools.check_district_block_cluster()
        if result == 0:
            print("Schools per cluster csv download report is working")
            print("on selection of each district,block and cluster")
            print("The footer value of no of schools and no of students are")
            print("equals to downloaded file")
        else:
            raise self.failureException("Schools per cluster csv report download not is working")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
