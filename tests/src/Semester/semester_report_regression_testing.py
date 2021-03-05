import time
import unittest

from Semester.Click_on_hyper_link_in_semester_report import Hyperlink
from Semester.check_semester_choose_district import District
from Semester.check_semester_choose_district_block import DistrictsBlock
from Semester.check_semester_choose_district_block_cluster import DistrictBlockCluster
from Semester.check_total_no_students_and_total_no_schools_sr import grade_subject_dropdowns
from Semester.click_on_Home_icon import Home
from Semester.click_on_blocks import Blocks

from Semester.click_on_clusters import Clusters
from Semester.click_on_schools import Schools
from Semester.click_on_semester_report import SemesterReport
from Semester.click_on_semester_report_and_logout import Logout

from Semester.download_blockwise_csv import BlockwiseCsv
from Semester.download_clusterwise_csv import ClusterwiseCsv
from Semester.download_districtwise_csv import DistrictwiseCsv
from Semester.download_schoolwise_csv import SchoolwiseCsv
from Semester.semester_options import Semester_options

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

    def test_click_on_semester_report(self):
        sr = SemesterReport(self.driver)
        result = sr.check_semester_landing_page()
        if "Semester Report" in result:
            print("Navigating to semester Report is working")
        else:
            raise self.failureException("Semester Report Not Found")



    def test_sem_options(self):
        b =Semester_options(self.driver)
        res1,res2 = b.test_semester_option()
        self.assertEqual(0,res1,msg="Semester 1 is selected ")
        self.assertNotEqual(0,res2,msg="Markers are missing on semeter2 map ")
        print('Semester 2 is working ')
        self.data.page_loading(self.driver)



    def test_click_on_blocks(self):
        block = Blocks(self.driver)
        result = block.check_markers_on_block_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")
        print("Blocks button is working")
        print("Markers are present on the map")

    def test_click_on_clusters(self):
        cluster = Clusters(self.driver)
        result = cluster.check_markers_on_clusters_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")
        print("Clusters button is working")
        print("Markers are present on the map")

    def test_click_on_schools(self):
        school = Schools(self.driver)
        result = school.check_markers_on_clusters_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")
        print("Schools button is working")
        print("Markers are present on the map")

    def test_logout(self):
        logout = Logout(self.driver)
        result = logout.click_on_logout()
        self.assertEqual("Log in to cQube", result, msg="login page is not exist!..")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        print("Logout Functionality is working")

    def test_check_hyperlinks(self):
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")

    def test_districtwise_csv_download(self):
        csv = DistrictwiseCsv(self.driver)
        result = csv.click_download_icon_of_district()
        if result == "Mismatch found at footer values":
            raise self.failureException(result)
        else:
            print("District wise csv report download is working")



    def test_blockwise_csv_download(self):
        csv = BlockwiseCsv(self.driver)
        result = csv.click_download_icon_of_blocks()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        else:
            print("Block wise csv report download is working")

    def test_clusterwise_csv_download(self):
        csv = ClusterwiseCsv(self.driver)
        result = csv.click_download_icon_of_clusters()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        else:
            print("Cluster wise csv report download is working")

    def test_schoolwise_csv_download(self):
        csv = SchoolwiseCsv(self.driver)
        result = csv.click_download_icon_of_schools()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        else:
            print("School wise csv report download is working")

    def test_home_button(self):
        self.driver.find_element_by_id('homeBtn').click()
        time.sleep(2)
        self.data.navigate_to_semester_report()
        if "Semester Report" in self.driver.page_source:
            print("test_home_button is working")
        else:
            raise self.failureException('test_home_button is not working')


    def test_home_icon(self):
        home = Home(self.driver)
        home.click_on_blocks_click_on_home_icon()
        result = home.click_HomeButton()
        if "Semester Report" in result:
            print("Home Icon is working")
        else:
            raise self.failureException('Home Icon is not working')

    def test_gradewise_csv_downloading(self):
        tc = grade_subject_dropdowns(self.driver)
        res = tc.check_grade_dropdown_options()
        self.assertNotEqual(0,res,msg="Grade options are not present ")
        print("Checked with grade options in sat map report")
        self.data.page_loading(self.driver)

        fun =  grade_subject_dropdowns(self.driver)
        res1 = fun.click_each_grades()
        self.assertEqual(0,res1,msg="gradewise csv file is not downloaded")

    def test_subjectwise_csv_downloading(self):
        tc = grade_subject_dropdowns(self.driver)
        res = tc.select_subjects_dropdown()
        self.assertEqual(0,res,msg="Subjectwise csv file is not downloaded")

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
