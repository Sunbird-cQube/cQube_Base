import time
import unittest

from SR.Click_on_hyper_link_in_semester_report import Hyperlink
from SR.check_cluster_per_block_csv_download import ClusterPerBlockCsvDownload
from SR.check_districts_csv_download import DistrictCsvDownload
from SR.check_dots_on_each_district_block import DotsOnDistrictsBlock
from SR.check_dots_on_each_districts import DotsOnDistricts
from SR.check_schools_per_cluster_csv_download import SchoolsPerClusterCsvDownload
from SR.check_with_total_schools_in_SR import TotalSchools
from SR.check_with_total_student_in_SR import TotalStudents
from SR.click_on_Home_icon import Home
from SR.click_on_blocks import Blocks
from SR.click_on_clusters import Clusters
from SR.click_on_dashboard import Dashboard
from SR.click_on_schools import Schools
from SR.click_on_semester_report import SemesterReport
from SR.click_on_semester_report_and_logout import Logout
from SR.cluster_level_comaparing_dots_with_no_of_schools import ClusterDotsWithNoOfSchools
from SR.download_blockwise_csv import BlockwiseCsv
from SR.download_clusterwise_csv import ClusterwiseCsv
from SR.download_districtwise_csv import DistrictwiseCsv
from SR.download_schoolwise_csv import SchoolwiseCsv
from reuse_func import GetData


class cQube_Semester_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 20
        self.tests = [0] * 21
        self.data = GetData()
        self.logger = self.data.get_functional_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        time.sleep(5)

    def test_click_on_dashboard(self):
        self.tests.pop()
        self.logger.info("test_click_on_dashboard is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        dashboard = Dashboard(self.driver)
        dashboard.click_on_dashboard()

        self.logger.info("test_click_on_dashboard is completed...")

    def test_click_on_semester_report(self):
        self.tests.pop()
        self.logger.info("test_click_on_student_attendence_report is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        sr = SemesterReport(self.driver)
        result = sr.click_on_semester()
        if "Semester Report" in result:
            print("This is Semester Report page")
        else:
            raise self.failureException("Semester Report Not Found")

        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_click_on_blocks(self):
        self.tests.pop()
        self.logger.info("test_click_on_blocks is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        block = Blocks(self.driver)
        result = block.check_markers_on_block_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")

        self.logger.info("test_click_on_blocks is completed...")

    def test_click_on_clusters(self):
        self.tests.pop()
        self.logger.info("test_click_on_clusters is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        cluster = Clusters(self.driver)
        result = cluster.check_markers_on_clusters_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")

        self.logger.info("test_click_on_clusters is completed...")

    def test_click_on_schools(self):
        self.tests.pop()
        self.logger.info("test_click_on_schools is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        school = Schools(self.driver)
        result = school.check_markers_on_clusters_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")

        self.logger.info("test_click_on_schools is completed...")

    def test_logout(self):
        self.tests.pop()
        self.logger.info("test_logout is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        logout = Logout(self.driver)
        result = logout.click_on_logout()
        self.assertEqual("cQube", result, msg="login page is not exist!..")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()

        self.logger.info("test_logout is completed...")

    def test_check_hyperlinks(self):
        self.tests.pop()
        self.logger.info("test_check_hyperlinks is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")

        self.logger.info("test_check_hyperlinks is completed...")

    def test_districtwise_csv_download(self):
        self.tests.pop()
        self.logger.info("test_districtwise_csv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        csv = DistrictwiseCsv(self.driver)
        result = csv.click_download_icon_of_district()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        self.logger.info("test_districtwise_csv_download is completed...")

    def test_blockwise_csv_download(self):
        self.tests.pop()
        self.logger.info("test_blockwise_csv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        csv = BlockwiseCsv(self.driver)
        result = csv.click_download_icon_of_blocks()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        self.logger.info("test_blockwise_csv_download is completed...")

    def test_clusterwise_csv_download(self):
        self.tests.pop()
        self.logger.info("test_clusterwise_csv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        csv = ClusterwiseCsv(self.driver)
        result = csv.click_download_icon_of_clusters()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        self.logger.info("test_clusterwise_csv_download is completed...")

    def test_schoolwise_cv_download(self):
        self.tests.pop()
        self.logger.info("test_schoolwise_cv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        csv = SchoolwiseCsv(self.driver)
        result = csv.click_download_icon_of_schools()
        if result == "File Not Downloaded":
            raise self.failureException(result)
        self.logger.info("test_schoolwise_cv_download is completed...")

    def test_no_of_schools_is_equals_at_districts_blocks_clusters_schools(self):
        self.tests.pop()
        self.logger.info(
            "test_no_of_schools_is_equals_at_districts_blocks_clusters_schools is running" + " " + "Total :" + " " + str(
                self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        tc = TotalSchools(self.driver)
        schools, Bschools = tc.block_no_of_schools()
        self.assertEqual(int(schools), int(Bschools), msg="Block level no of schools are not equal to no of schools ")
        schools, Cschools = tc.cluster_no_of_schools()
        self.assertEqual(int(schools), int(Cschools), msg="Cluster level no of schools are not equal to no of schools ")
        schools, Sschools = tc.schools_no_of_schools()
        self.assertEqual(int(schools), int(Sschools), msg="Cluster level no of schools are not equal to no of schools ")

        self.logger.info("test_no_of_schools_is_equals_at_districts_blocks_clusters_schools is completed...")

    def test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools(self):
        self.tests.pop()
        self.logger.info(
            "test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools is running" + " " + "Total :" + " " + str(
                self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        tc = TotalStudents(self.driver)
        student_count, Bstudents = tc.block_total_no_of_students()
        self.assertEqual(int(student_count), int(Bstudents), msg="Block level no of students are not equal")
        student_count, Cstudents = tc.cluster_total_no_of_students()
        self.assertEqual(int(student_count), int(Cstudents), msg="Cluster level no of students are not equal")
        student_count, Sstudents = tc.schools_total_no_of_students()
        self.assertEqual(int(student_count), int(Sstudents), msg="Cluster level no of students are not equal")

        self.logger.info("test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools is completed...")

    def test_no_of_schools_and_no_of_dots_are_equal_at_each_cluster_level(self):
        self.tests.pop()
        self.logger.info(
            "test_no_of_schools_and_no_of_dots_are_equal_at_each_cluster_level is running" + " " + "Total :" + " " + str(
                self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        cluster = ClusterDotsWithNoOfSchools(self.driver)
        result = cluster.comapre_cluster()
        if result != 0:
            raise self.failureException('data not matched')

        self.logger.info("test_no_of_schools_and_no_of_dots_are_equal_at_each_cluster_level is completed...")

    def test_home_icon(self):
        self.tests.pop()
        self.logger.info("test_home_icon is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        home = Home(self.driver)
        home.click_on_blocks_click_on_home_icon()
        result = home.click_HomeButton()

        self.logger.info("test_home_icon is completed...")

    def test_block_per_district_csv_download(self):
        self.tests.pop()
        self.logger.info("test_block_per_district_csv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        dist = DistrictCsvDownload(self.driver)
        result = dist.check_districts_csv_download()
        self.assertEqual(0, result, msg="Some files are not downloaded")

        self.logger.info("test_block_per_district_csv_download is completed...")

    #
    def test_cluster_per_block_csv_download(self):
        self.tests.pop()
        self.logger.info("test_cluster_per_block_csv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        block = ClusterPerBlockCsvDownload(self.driver)
        result = block.check_csv_download()
        self.assertEqual(0, result, msg="Some files are not downloaded")

        self.logger.info("test_cluster_per_block_csv_download is completed...")

    #
    def test_schools_per_cluster_csv_download(self):
        self.tests.pop()
        self.logger.info("test_schools_per_cluster_csv_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        schools = SchoolsPerClusterCsvDownload(self.driver)
        result = schools.check_csv_download()
        self.assertEqual(0, result, msg="Some files are not downloaded")

        self.logger.info("test_schools_per_cluster_csv_download is completed...")

    #
    def test_dots_on_each_districts(self):
        self.tests.pop()
        self.logger.info("test_dots_on_each_districts is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        dist = DotsOnDistricts(self.driver)
        result = dist.check_dots_on_each_districts()
        if result != 0:
            raise self.failureException('data not found')

        self.logger.info("test_dots_on_each_districts is completed...")

    #
    def test_dots_on_each_districts_and_each_block(self):
        self.tests.pop()
        self.logger.info("test_dots_on_each_districts_and_each_block is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        dist_block = DotsOnDistrictsBlock(self.driver)
        result = dist_block.check_dots_on_each_districts_block()
        if result != 0:
            raise self.failureException('data not found')

        self.logger.info("test_dots_on_each_districts_and_each_block is completed...")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
