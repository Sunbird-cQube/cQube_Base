import unittest
from Semester_Exception.check_cluster_per_block_csv_download import ClusterPerBlockCsvDownload
from Semester_Exception.check_districts_csv_download import DistrictwiseDownload
from Semester_Exception.click_on_blocks import Semester_Blocks
from Semester_Exception.click_on_clusters import semester_clusters
from Semester_Exception.click_on_schools import semeste_schools
from Semester_Exception.sem_exception_options import sem_options
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

    def test_Semester_Blocks(self):
        b = Semester_Blocks(self.driver)
        res = b.check_markers_on_block_map()
        self.assertNotEqual(0, res, msg="markers are not present on block level map")

    def test_semester_clusters(self):
        b = semester_clusters(self.driver)
        res = b.check_markers_on_clusters_map()
        self.assertNotEqual(0, res, msg="markers are not present on cluster level map")

    def test_semesterschool(self):
        b = semeste_schools(self.driver)
        res = b.check_markers_on_school_map()
        self.assertNotEqual(0, res, msg="markers are not present on cluster level map")

    def test_DistrictwiseDownload(self):
        b = DistrictwiseDownload(self.driver)
        res = b.check_districts_csv_download()
        self.assertEqual(0, res, msg="Some district level csv file is not downloaded")

    def test_ClusterPerBlockCsvDownload(self):
        b = ClusterPerBlockCsvDownload(self.driver)
        res = b.check_csv_download()
        self.assertEqual(0,res , msg='Some cluster level files are not downloaded')

    def test_options(self):
        d = sem_options(self.driver)
        res = d.sem_exception_options_test()
        self.assertEqual(0,res,msg='Csv file is downloaded')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()