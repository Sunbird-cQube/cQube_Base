import time
import unittest

from SR.Click_on_hyper_link_in_semester_report import Hyperlink
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

from SR.download_blockwise_csv import BlockwiseCsv
from SR.download_clusterwise_csv import ClusterwiseCsv
from SR.download_districtwise_csv import DistrictwiseCsv
from SR.download_schoolwise_csv import SchoolwiseCsv

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

    def test_click_on_dashboard(self):
        dashboard = Dashboard(self.driver)
        dashboard.click_on_dashboard()
        print("Navigating to Dashboard is working")

    def test_click_on_semester_report(self):
        sr = SemesterReport(self.driver)
        result = sr.click_on_semester()
        if "Semester Report" in result:
            print("Navigating to semester Report is working")
        else:
            raise self.failureException("Semester Report Not Found")

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
        if result == "File Not Downloaded":
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

    def test_no_of_schools_is_equals_at_districts_blocks_clusters_schools(self):
        tc = TotalSchools(self.driver)
        schools, Bschools = tc.block_no_of_schools()
        self.assertEqual(int(schools), int(Bschools), msg="Block level no of schools are not equal to no of schools ")
        schools, Cschools = tc.cluster_no_of_schools()
        self.assertEqual(int(schools), int(Cschools), msg="Cluster level no of schools are not equal to no of schools ")
        schools, Sschools = tc.schools_no_of_schools()
        self.assertEqual(int(schools), int(Sschools), msg="Cluster level no of schools are not equal to no of schools ")
        print("Total number of schools equals on clicking of blocks,clusters,schools")

    def test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools(self):
        tc = TotalStudents(self.driver)
        student_count, Bstudents = tc.block_total_no_of_students()
        self.assertEqual(int(student_count), int(Bstudents), msg="Block level no of students are not equal")
        student_count, Cstudents = tc.cluster_total_no_of_students()
        self.assertEqual(int(student_count), int(Cstudents), msg="Cluster level no of students are not equal")
        student_count, Sstudents = tc.schools_total_no_of_students()
        self.assertEqual(int(student_count), int(Sstudents), msg="Cluster level no of students are not equal")
        print("Total number of students equals on clicking of blocks,clusters,schools")

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


    def test_block_per_district_csv_download(self):
        dist = DistrictCsvDownload(self.driver)
        result = dist.check_districts_csv_download()
        self.assertEqual(0, result, msg="Some files are not downloaded")
        print("Block per district csv report download is working")
        print("on selection of each district")
        print("The footer value of no of schools and no of students are")
        print("equals to downloaded file")


    def test_cluster_per_block_csv_download(self):
        block = ClusterPerBlockCsvDownload(self.driver)
        result = block.check_csv_download()
        self.assertEqual(0, result, msg="Some files are not downloaded")
        print("Cluster per block csv report download is working")
        print("on selection of each district and block")
        print("The footer value of no of schools and no of students are")
        print("equals to downloaded file")


    def test_schools_per_cluster_csv_download1(self):
        self.driver = self.data.get_driver_SR_Download1()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        schools = SchoolsPerClusterCsvDownload(self.driver)
        result = schools.check_csv_download1()
        self.assertEqual(0, result, msg="Some files are not downloaded")
        print("Schools per cluster csv download report is working")
        print("on selection of each district,block and cluster")
        print("The footer value of no of schools and no of students are")
        print("equals to downloaded file")

    def test_schools_per_cluster_csv_download2(self):
        self.driver = self.data.get_driver_SR_Download2()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        schools = SchoolsPerClusterCsvDownload(self.driver)
        result = schools.check_csv_download2()
        self.assertEqual(0, result, msg="Some files are not downloaded")
        print("Schools per cluster csv download report is working")
        print("on selection of each district,block and cluster")
        print("The footer value of no of schools and no of students are")
        print("equals to downloaded file")

    def test_schools_per_cluster_csv_download3(self):
        self.driver = self.data.get_driver_SR_Download3()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        schools = SchoolsPerClusterCsvDownload(self.driver)
        result = schools.check_csv_download3()
        self.assertEqual(0, result, msg="Some files are not downloaded")
        print("Schools per cluster csv download report is working")
        print("on selection of each district,block and cluster")
        print("The footer value of no of schools and no of students are")
        print("equals to downloaded file")

    def test_schools_per_cluster_csv_download4(self):
        self.driver = self.data.get_driver_SR_Download4()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()
        schools = SchoolsPerClusterCsvDownload(self.driver)
        result = schools.check_csv_download4()
        self.assertEqual(0, result, msg="Some files are not downloaded")
        print("Schools per cluster csv download report is working")
        print("on selection of each district,block and cluster")
        print("The footer value of no of schools and no of students are")
        print("equals to downloaded file")

    def test_dots_on_each_districts(self):
        dist = DotsOnDistricts(self.driver)
        result = dist.check_dots_on_each_districts()
        if result != 0:
            raise self.failureException('data not found')
        else:
            print("Markers are present on selection of each district")


    def test_dots_on_each_districts_and_each_block(self):
        dist_block = DotsOnDistrictsBlock(self.driver)
        result = dist_block.check_dots_on_each_districts_block()
        if result != 0:
            raise self.failureException('data not found')
        else:
            print("Markers are present on selection of each district and block")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
