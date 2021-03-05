import time
import unittest
from selenium.webdriver.support.select import Select
from Data.parameters import Data

from Teacher_Attendance.Click_on_hyper_link_in_TAR import Hyperlink
from Teacher_Attendance.check_cluster_per_block_csv_download import ClusterPerBlockCsvDownload
from Teacher_Attendance.check_data_range import DateRange
from Teacher_Attendance.check_districts_csv_download import DistrictCsvDownload
from Teacher_Attendance.check_with_total_schools_in_TAR import TotalSchools

from Teacher_Attendance.check_with_total_student_in_TAR import TotalStudents
from Teacher_Attendance.click_on_Home_icon import Home
from Teacher_Attendance.click_on_TAR_and_logout import Logout
from Teacher_Attendance.click_on_blocks import Blocks
from Teacher_Attendance.click_on_clusters import Clusters

from Teacher_Attendance.click_on_dashboard import Dashboard
from Teacher_Attendance.click_on_schools import Schools
from Teacher_Attendance.click_on_teacher import DahboardSar
from Teacher_Attendance.download_blockwise_csv import BlockwiseCsv
from Teacher_Attendance.download_clusterwise_csv import ClusterwiseCsv

from Teacher_Attendance.download_districtwise_csv import DistrictwiseCsv
from Teacher_Attendance.download_schoolwise_csv import SchoolwiseCsv

from reuse_func import GetData


class Teacher_FunctionalTesting(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_teacher_attendance_report()
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        self.year = year.first_selected_option.text
        self.month = month.first_selected_option.text

    def test_click_on_dashboard(self):
        dashboard = Dashboard(self.driver)
        dashboard.click_on_dashboard()

    def test_click_on_teacher_attendence_report(self):
        tar = DahboardSar(self.driver)
        result = tar.click_on_sar()
        if "Teacher Attendance Report" in result:
            print("This is Teacher Attendance Report page")
        else:
            print("Teacher_Attendance page does not exist!...")


    def test_click_on_blocks(self):
        block = Blocks(self.driver)
        result = block.check_markers_on_block_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")

    def test_click_on_clusters(self):
        cluster = Clusters(self.driver)
        result = cluster.check_markers_on_clusters_map()
        self.assertNotEqual(0, len(result) - 1, msg="Dots are not present on map")

    def test_click_on_schools(self):
        school = Schools(self.driver)
        result = school.check_markers_on_clusters_map()
        self.assertNotEqual(0, int(len(result) - 1), msg="Dots are not present on map")


    def test_logout(self):
        logout = Logout(self.driver)
        result = logout.click_on_logout()
        self.assertEqual("Log in to cQube", result, msg="login page is not exist!..")
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_teacher_attendance_report()
        self.data.page_loading(self.driver)
        self.data.select_month_year(self.year, self.month)

    def test_check_hyperlinks(self):
        hyperlinks = Hyperlink(self.driver)
        result1,result2,choose_dist= hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District " :
            print("hyperlinks are working")
        else :
            raise self.failureException("hyperlinks are not working")

    def test_districtwise_csv_download(self):
        csv = DistrictwiseCsv(self.driver, self.year, self.month)
        result = csv.click_download_icon_of_district()
        self.assertEqual(0, result, msg='Mis match found at footer information')
        print('Districtwise csv file is downloaded')
        self.data.page_loading(self.driver)


    def test_blockwise_btn_csv_download(self):
        csv = BlockwiseCsv(self.driver, self.year, self.month)
        result = csv.click_download_icon_of_blocks()
        if result:
            print("Block wise csv report download is working")
            csv.remove_csv()
        else:
            raise self.failureException("Block wise csv report download is not working")

    def test_clusterwise_btn_csv_download(self):
        csv = ClusterwiseCsv(self.driver, self.year, self.month)
        result = csv.click_download_icon_of_clusters()
        if result:
            print("Cluster wise csv report download is working")
            csv.remove_csv()
        else:
            raise self.failureException("Cluster wise csv report download is not working")

    def test_schoolwise_tn_csv_download(self):
        csv = SchoolwiseCsv(self.driver, self.year, self.month)
        result = csv.click_download_icon_of_schools()
        if result:
            print("School wise csv report download is working")
            csv.remove_csv()
        else:
            raise self.failureException("School wise csv report download is not working")

    def test_no_of_schools_is_equals_at_districts_blocks_clusters_schools(self):
        tc = TotalSchools(self.driver)
        schools, Bschools = tc.block_no_of_schools()
        self.assertEqual(int(schools), int(Bschools), msg="Block level no of schools are not equal to no of schools ")
        schools, Cschools = tc.cluster_no_of_schools()
        self.assertEqual(int(schools), int(Cschools), msg="Cluster level no of schools are not equal to no of schools ")
        schools, Sschools = tc.schools_no_of_schools()
        self.assertEqual(int(schools), int(Sschools), msg="Cluster level no of schools are not equal to no of schools ")

    def test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools(self):
        tc = TotalStudents(self.driver)
        student_count, Bstudents = tc.block_total_no_of_teachers()
        self.assertEqual(int(student_count), int(Bstudents), msg="Block level no of students are not equal")
        student_count, Cstudents = tc.cluster_total_no_of_teachers()
        self.assertEqual(int(student_count), int(Cstudents), msg="Cluster level no of students are not equal")
        student_count, Sstudents = tc.schools_total_no_of_teacher()
        self.assertEqual(int(student_count), int(Sstudents), msg="Cluster level no of students are not equal")



    def test_home_icon(self):
        home = Home(self.driver)
        home.click_on_blocks_click_on_home_icon()
        self.data.page_loading(self.driver)
        result = home.click_HomeButton()
        if "teacher-attendance" in self.driver.current_url:
            print("This is Teacher Attendance Report page")
        else:
            raise self.failureException('Home Icon is not working')

    def test_block_per_district_csv_download(self):
        dist = DistrictCsvDownload(self.driver,self.year,self.month)
        result = dist.check_districts_csv_download()
        if result == 0:
            print("Block per district csv report download is working")
        else:
            raise self.failureException("Block per district csv report download is working")

    def test_cluster_per_block_csv_download(self):
        block = ClusterPerBlockCsvDownload(self.driver,self.year,self.month)
        result = block.check_csv_download()
        if result == 0:
            print("Cluster per block csv report download is working")
        else:
            raise self.failureException("Cluster per block csv report download is working")

    def test_schoolwise_csv_download(self):
        block = ClusterPerBlockCsvDownload(self.driver, self.year, self.month)
        result = block.check_school_level_csv_download()
        if result == 0:
            print("School per cluster csv report download is working")
        else:
            raise self.failureException("School per cluster csv report download is working")

    def test_date_range(self):
        daterange = DateRange(self.driver)
        result = daterange.check_date_range()
        self.driver.find_element_by_id('homeBtn').click()
        time.sleep(2)
        self.data.navigate_to_teacher_attendance_report()
        # if result != 0:
        #  raise self.failureException('Data Range in correct')

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
