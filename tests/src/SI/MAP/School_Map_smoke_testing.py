import unittest

from SI.MAP.check_with_districts_from_select_box import District_names
from SI.MAP.check_with_map_on_schoolinfra import check_markers_on_map
from SI.MAP.check_with_schoolinfra_options import School_infra_options
from SI.MAP.click_on_Dashboard import click_dashboard
from SI.MAP.click_on_anydistrict_and_download_csv import download_icon

from SI.MAP.click_on_blk_clus_school_and_home import click_on_home
from SI.MAP.click_on_block_cluster_school_and_check_schoolscount import Block_cluster_school_count
from SI.MAP.click_on_blocks import click_on_blocks
from SI.MAP.click_on_clusters import cluster_button
from SI.MAP.click_on_district_options import District_options

from SI.MAP.click_on_hyperlink import click_on_hyperlink
from SI.MAP.click_on_infra_scores_options import select_infrascore_options
from SI.MAP.download_districtwise_csv import districtwise_csv
from SI.MAP.mouseover_on_districtwise import mouseover
from SI.MAP.select_district_block_from_select_box import select_blockwise

from reuse_func import GetData


class cQube_SI_Map_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure_map()
        self.data.page_loading(self.driver)

    def test_click_on_block(self):
        print("Clicking on blocks button ")
        b = click_on_blocks(self.driver)
        res = b.test_blocks_button()
        self.assertNotEqual(0, res, msg="Records are not present on map ")
        self.data.page_loading(self.driver)

    def test_check_district_names(self):
        print("check with districtwise drop down")
        b = District_names(self.driver)
        result = b.test_districtlist()
        self.assertNotEqual(0, result, msg="All Districts are not present in select box!..")
        self.data.page_loading(self.driver)

    def test_check_markers_on_map(self):
        print("checking markers on map ")
        b = check_markers_on_map(self.driver)
        result = b.test_map()
        self.assertNotEqual(0,result,msg="Data not present on map")
        self.data.page_loading(self.driver)

    def test_school_infra_options(self):
        print("school infra drop down")
        b = School_infra_options(self.driver)
        res1, res2 = b.test_options()
        self.assertEqual(res1, "Composite Report", msg="option is not available")
        self.assertEqual(res2, "Infrastructure access by Location", msg="option is not available")
        self.data.page_loading(self.driver)

    def test_districtwise_download(self):
        b = download_icon(self.driver)
        res = b.test_donwload()
        self.assertEqual(0, res, msg="mismatch found at no of school values")
        self.data.page_loading(self.driver)

    def test_click_on_home(self):
        print("check with footer values")
        b = click_on_home(self.driver)
        c1, c2, c3 = b.test_home()
        self.assertNotEqual(0, c1, msg="Records are not present on map ")
        self.assertNotEqual(0, c2, msg="Records are not present on map ")
        self.assertNotEqual(0, c3, msg="Records are not present on map ")
        self.data.page_loading(self.driver)

    def test_no_of_schools(self):
        print("check with no of school values ")
        b = Block_cluster_school_count(self.driver)
        r, r1, r2, r3 = b.test_check_total_schoolvalue()
        self.assertEqual(int(r), int(r1), msg="mis match found in no of school in block level")
        self.assertEqual(int(r), int(r2), msg="mis match found in no of school in cluster level")
        self.assertEqual(int(r), int(r3), msg="mis match found in no of school in school level")
        self.data.page_loading(self.driver)

    def test_dashboard(self):
        print("Dashboard is working")
        b = click_dashboard(self.driver)
        res = b.test_dashboard()
        self.data.page_loading(self.driver)

    def test_district_options(self):
        print("districtwise functionality working fine")
        b = District_options(self.driver)
        res = b.test_options()
        self.assertNotEqual(0, res, msg="district list are present")
        self.data.page_loading(self.driver)

    def test_clusterbtn(self):
        print("check with cluster button ")
        b = cluster_button(self.driver)
        self.assertNotEqual(0, b, msg="Records are not present on map ")
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = click_on_hyperlink(self.driver)
        res = b.test_link()
        if "school-infra-map" in self.driver.current_url:
            print("school infra map based report present")
        else:
            print("home icon is not working ")
        self.data.page_loading(self.driver)

    def test_infrascore_click(self):
        print("click on each infra scores dropdown")
        b = select_infrascore_options(self.driver)
        res = b.test_infrascores()
        self.assertNotEqual(0, res, msg="infra score options not contains in drop down")
        self.data.page_loading(self.driver)

    def test_districtwise_csv(self):
        print("download districtwise csv file")
        b = districtwise_csv(self.driver)
        res = b.test_districtwise()
        self.data.page_loading(self.driver)

    def test_mouseover_on_dots(self):
        print("mouseover on markers present on map")
        b = mouseover(self.driver)
        res  =b.test_mousehover()
        count = self.data.test_mouse_over()
        self.assertNotEqual(0,count,msg="markers not present in map ")
        self.data.page_loading(self.driver)

    def test_blockwise(self):
        print("check with blockwise records")
        b =select_blockwise(self.driver)
        res = b.test_dist_blocks()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()