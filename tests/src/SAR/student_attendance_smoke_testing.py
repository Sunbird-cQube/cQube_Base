import time
import unittest

from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from Data.parameters import Data
from SAR.Click_on_hyper_link_in_SAR import Hyperlink
from SAR.check_data_range import DateRange
from SAR.check_with_total_schools_in_SAR import TotalSchools
from SAR.check_with_total_student_in_SAR import TotalStudents
from SAR.click_on_Home_icon import Home
from SAR.click_on_SAR import DahboardSar
from reuse_func import GetData


class cQube_Student_Attendance(unittest.TestCase):

    @classmethod
    def setUpClass(self):

        self.total_tests = 16
        self.tests = [0] * 17
        self.data = GetData()
        self.logger = self.data.get_smoke_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_student_report()
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        self.year = year.first_selected_option.text
        self.month = month.first_selected_option.text


    def test_click_on_student_attendence_report(self):
        self.tests.pop()
        self.logger.info("test_click_on_student_attendence_report is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        sar = DahboardSar(self.driver)
        result = sar.click_on_sar()
        if "Student Attendance Report" in result:
            print("Student Attendance Report is Working")
        else:
            raise self.failureException("Student Attendance Report Is Not Working")
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_click_on_blocks(self):
        self.tests.pop()
        self.logger.info("test_click_on_blocks is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.SAR_Blocks_btn))
        )
        try:
            element.click()
            time.sleep(5)
            print("Blocks Button is working")
        except WebDriverException:
            raise self.failureException("Blocks Button is not clickable")
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_click_on_clusters(self):
        self.tests.pop()
        self.logger.info("test_click_on_clusters is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.SAR_Clusters_btn))
        )
        try:
            element.click()
            self.data.page_loading(self.driver)
            print("Cluster Button is working")
        except WebDriverException:
            raise self.failureException("Cluster Button is not working")
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_click_on_schools(self):
        self.tests.pop()
        self.logger.info("test_click_on_schools is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.SAR_Schools_btn))
        )
        try:
            element.click()
            self.data.page_loading(self.driver)
            print("Schools Button is working")
        except WebDriverException:
            raise self.failureException("Schools Button is not working")
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_logout(self):
        self.tests.pop()
        self.logger.info("test_logout is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.assertEqual("Log in to cQube", self.driver.title,msg="Logout is not worked")
        time.sleep(2)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_student_report()
        print("Logout functionality is working fine...")
        self.data.page_loading(self.driver)
        self.logger.info("test_logout is completed...")


    def test_check_hyperlinks(self):
        self.tests.pop()
        self.logger.info("test_check_hyperlinks is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District ":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")
        self.logger.info("test_check_hyperlinks is completed...")

    def test_select_year(self):
        self.tests.pop()
        self.logger.info("test_select_year is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        try:
            for x in range(1, len(year.options)):
                year.select_by_index(x)
                self.data.page_loading(self.driver)
            print("Select year is working")
        except WebDriverException:
            raise self.failureException("Select Year is not working")
        self.logger.info("test_select_year is completed...")

    def test_select_month(self):
        self.tests.pop()
        self.logger.info("test_select_month is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        try:
            for x in range(1, len(month.options)):
                month.select_by_index(x)
                self.data.page_loading(self.driver)
            print("Select month is working")
        except WebDriverException:
            raise self.failureException("Select month is not working")
        self.logger.info("test_select_month is completed...")

    def test_choose_district(self):
        self.tests.pop()
        self.logger.info("test_choose_district is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        choose_district = Select(self.driver.find_element_by_id(Data.sar_district))
        try:
            for x in range(1, len(choose_district.options)):
                choose_district.select_by_index(x)
                self.data.page_loading(self.driver)
            print("Choose District is working")
        except WebDriverException:
            raise self.failureException("Choose District is not working")
        self.logger.info("test_choose_district is completed...")

    def test_choose_block(self):
        self.tests.pop()
        self.logger.info("test_choose_block is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        self.data.click_on_state(self.driver)
        choose_district = Select(self.driver.find_element_by_id(Data.sar_district))
        choose_block = Select(self.driver.find_element_by_id(Data.sar_block))

        try:
            for x in range(len(choose_district.options) - 1, len(choose_district.options)):
                choose_district.select_by_index(x)
                self.data.page_loading(self.driver)
                for y in range(len(choose_block.options) - 1, len(choose_block.options)):
                    choose_block.select_by_index(y)
                    self.data.page_loading(self.driver)
            print("Choose District and Block is working")
        except WebDriverException:
            raise self.failureException("Choose District and Block is not working")
        self.logger.info("test_choose_block is completed...")

    def test_choose_cluster(self):
        self.tests.pop()
        self.logger.info("test_choose_cluster is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        self.data.click_on_state(self.driver)
        choose_district = Select(self.driver.find_element_by_id(Data.sar_district))
        choose_block = Select(self.driver.find_element_by_id(Data.sar_block))
        choose_cluster = Select(self.driver.find_element_by_id(Data.sar_cluster))

        try:
            for x in range(len(choose_district.options) - 1, len(choose_district.options)):
                choose_district.select_by_index(x)
                self.data.page_loading(self.driver)
                for y in range(len(choose_block.options) - 1, len(choose_block.options)):
                    choose_block.select_by_index(y)
                    self.data.page_loading(self.driver)
                    for z in range(1, len(choose_cluster.options)):
                        choose_cluster.select_by_index(z)
                        self.data.page_loading(self.driver)
            print("Choose District,Block and Cluster is working")
        except WebDriverException:
            raise self.failureException("Choose District,Block and Cluster is not working")
        self.logger.info("test_choose_cluster is completed...")

    def test_home_icon(self):
        self.tests.pop()
        self.logger.info("test_home_icon is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        home = Home(self.driver)
        home.click_on_blocks_click_on_home_icon()
        result = home.click_HomeButton()
        if "Student Attendance Report" in result:
            print("Home Icon is Working")
        else:
            raise self.failureException('Home Icon is not working')
        self.logger.info("test_home_icon is completed...")

    def test_download(self):
        self.tests.pop()
        self.logger.info("test_download is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        element = self.driver.find_element_by_id(Data.sar_download)
        try:
            element.click()
            time.sleep(2)
            print("Download Button is working")
        except WebDriverException:
            raise self.failureException("Download Button is not working")
        self.logger.info("test_download is completed...")

    def test_markers_on_map(self):
        self.tests.pop()
        self.logger.info("test_markers_on_map is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        state = GetData()
        state.click_on_state(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        if int(len(dots) - 1) != 0:
            print('Markers are present on the map')
        else:
            raise self.failureException("Markers are not present on the map")
        self.logger.info("test_markers_on_map is completed...")

    def test_no_of_schools_is_equals_at_districts_blocks_clusters_schools(self):
        self.tests.pop()
        self.logger.info("test_no_of_schools_is_equals_at_districts_blocks_clusters_schools is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
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
        self.logger.info("test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools is running"+" "+"Total :"+" "+ str(self.total_tests) +" "+"Remaining :"+" " + str(len(self.tests)-1))
        tc = TotalStudents(self.driver)
        student_count, Bstudents = tc.block_total_no_of_students()
        self.assertEqual(int(student_count), int(Bstudents), msg="Block level no of students are not equal")
        student_count, Cstudents = tc.cluster_total_no_of_students()
        self.assertEqual(int(student_count), int(Cstudents), msg="Cluster level no of students are not equal")
        student_count, Sstudents = tc.schools_total_no_of_students()
        self.assertEqual(int(student_count), int(Sstudents), msg="Cluster level no of students are not equal")
        self.logger.info("test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools is completed...")

    def test_date_range(self):
        self.tests.pop()
        self.logger.info("test_date_range is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        daterange = DateRange(self.driver)
        result = daterange.check_date_range()
        self.driver.find_element_by_id('homeBtn').click()
        time.sleep(2)
        self.data.navigate_to_student_report()
        if result != 0:
         raise self.failureException('Data Range in correct')
        self.logger.info("test_date_range is completed...")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
