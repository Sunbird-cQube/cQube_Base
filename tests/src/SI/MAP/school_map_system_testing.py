import time
import unittest

from SI.MAP.check_infrascore_with_download_functionality import SchoolInfra_scores
from SI.MAP.check_sc_map_clusterwise_records import test_school_map_schoollevel_records
from SI.MAP.click_on_anydistrict_and_download_csv import download_icon
from SI.MAP.click_on_blocksbtn_and_check_download import Blockwise_csv_download
from SI.MAP.click_on_cluster_check_download import clusterwise_download

from SI.MAP.click_on_school_and_check_download import school_wise_download
from SI.MAP.mouseover_on_districtwise import mouseover

from reuse_func import GetData


class cQube_SI_Map_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure_map()
        time.sleep(5)

    def test_districtwise_download(self):
        b = download_icon(self.driver)
        res = b.test_donwload()
        self.assertEqual(0, res, msg="mismatch found at no of school values")
        self.data.page_loading(self.driver)

    def test_schools_per_cluster_csv_download1(self):
        school = test_school_map_schoollevel_records(self.driver)
        result = school.check_download_csv1()
        if result == 0:
            print("Schools per cluster csv download report is working")
            print("on selection of each district,block and cluster")
            print("The footer value of no of schools and no of students are")
            print("equals to downloaded file")
        else:
            raise self.failureException("Schools per cluster csv report download1 is working")

    def test_infrascore(self):
        b = SchoolInfra_scores(self.driver)
        infra_score = b.infra_score()
        b.remove_csv()
        self.assertNotEqual(0, infra_score, msg='Failed')

        boy_toilet = b.Boys_toilet_percentage()
        b.remove_csv()
        self.assertNotEqual(0, boy_toilet, msg='Failed')

        drinking_water = b.drinking_water()
        b.remove_csv()
        self.assertNotEqual(0, drinking_water, msg='Failed')

        Electricity = b.Electricity()
        b.remove_csv()
        self.assertNotEqual(0, Electricity, msg='Failed')

        girl_toilet = b.girls_toilet()
        b.remove_csv()
        self.assertNotEqual(0, girl_toilet, msg='Failed')

        Handpump = b.Handpump()
        b.remove_csv()
        self.assertNotEqual(0, Handpump, msg='Failed')

        Handwash = b.Handwash()
        b.remove_csv()
        self.assertNotEqual(0, Handwash, msg='Failed')

        Library = b.Library()
        b.remove_csv()
        self.assertNotEqual(0, Library, msg='Failed')

        Solar_panel = b.Solar_panel()
        b.remove_csv()
        self.assertNotEqual(0, Solar_panel, msg='Failed')

        Tapwater = b.Tapwater()
        b.remove_csv()
        self.assertNotEqual(0, Tapwater, msg='Failed')

        Toilet = b.Toilet()
        b.remove_csv()
        self.assertNotEqual(0, Toilet, msg='Failed')

    def test_blocklevel_file(self):
        b = Blockwise_csv_download(self.driver)
        res1, res2 = b.test_download_blockwise()
        self.assertTrue(res1, msg="Blockwise csv file is not downloaded")
        self.assertNotEqual(0, res2, msg="markers are not present on block level map ")
        print("blocklevel file is downloaded")

    def test_clusterwise_download(self):
        b = clusterwise_download(self.driver)
        res1, res2 = b.test_download()
        self.assertTrue(res1, msg="clusterwise csv file is not downloaded")
        self.assertNotEqual(0, res2, msg="markers are not present on block level map ")
        print("cluster wise csv is downloading working")

    def test_schoolwise_download(self):
        b = school_wise_download(self.driver)
        res1, res2 = b.test_schoolwise()
        self.assertTrue(res1, msg="School level csv file is not downloaded")
        self.assertNotEqual(0, res2, msg="markers are not present on block level map ")
        print("school wise csv is downloaded")

    def test_mouseover_on_dots(self):
        b = mouseover(self.driver)
        res = b.test_mousehover()
        count = self.data.test_mouse_over()
        self.assertNotEqual(0, count, msg="markers not present in map ")
        print("markers present on map ")


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

