import time
import unittest

from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from Data.parameters import Data
from SR.Click_on_hyper_link_in_semester_report import Hyperlink
from SR.check_with_total_schools_in_SR import TotalSchools
from SR.check_with_total_student_in_SR import TotalStudents
from SR.click_on_Home_icon import Home
from SR.click_on_semester_report import SemesterReport
from reuse_func import GetData


class cQube_Semester_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 15
        self.tests = [0] * 16
        self.data = GetData()
        self.logger = self.data.get_smoke_log()
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_semester_report()

    def test_click_on_semester_report(self):
        self.tests.pop()
        self.logger.info("test_click_on_semester_report is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        sr = SemesterReport(self.driver)
        result = sr.click_on_semester()
        if "Semester Report" in result:
            print("Semester Report is Working")
        else:
            raise self.failureException("Semester Report Is Not Working")
        self.data.page_loading(self.driver)
        self.logger.info("test_click_on_semester_report is completed...")

    def test_click_on_blocks(self):
        self.tests.pop()
        self.logger.info("test_click_on_blocks is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        self.data = GetData()
        self.data.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.sr_block_btn))
        )
        try:
            element.click()
            self.data.page_loading(self.driver)
            print("Blocks Button is working")
        except WebDriverException:
            raise self.failureException("Blocks Button is not clickable")
        self.data.page_loading(self.driver)
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_click_on_clusters(self):
        self.tests.pop()
        self.logger.info("test_click_on_clusters is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.sr_cluster_btn))
        )
        try:
            element.click()
            self.data.page_loading(self.driver)
            print("Cluster Button is working")
        except WebDriverException:
            raise self.failureException("Cluster Button is not working")
        self.data.page_loading(self.driver)
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_click_on_schools(self):
        self.tests.pop()
        self.logger.info("test_click_on_schools is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.sr_schools_btn))
        )
        try:
            element.click()
            self.data.page_loading(self.driver)
            print("Schools Button is working")
        except WebDriverException:
            raise self.failureException("Schools Button is not working")
        self.data.page_loading(self.driver)
        self.logger.info("test_click_on_student_attendence_report is completed...")

    def test_logout(self):
        self.tests.pop()
        self.logger.info(
            "test_logout is running" + " " + "Total :" + " " + str(self.total_tests) + " " + "Remaining :" + " " + str(
                len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        element = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, Data.Logout))
        )
        try:
            element.click()
            print("Logout Button is working")
            self.data.login_cqube(self.driver)
            self.data.navigate_to_semester_report()
            self.data.page_loading(self.driver)
        except WebDriverException:
            raise self.failureException("Logout Button is not working")
        self.data.page_loading(self.driver)
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
        self.data.page_loading(self.driver)
        self.logger.info("test_check_hyperlinks is completed...")

    def test_choose_district(self):
        self.tests.pop()
        self.logger.info("test_choose_district is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        choose_district = Select(self.driver.find_element_by_id(Data.sr_district))
        try:
            for x in range(1, len(choose_district.options)):
                choose_district.select_by_index(x)
                self.data.page_loading(self.driver)
            print("Choose District is working")
        except WebDriverException:
            raise self.failureException("Choose District is not working")
        self.data.page_loading(self.driver)
        self.logger.info("test_choose_district is completed...")

    def test_choose_block(self):
        self.tests.pop()
        self.logger.info("test_choose_block is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        choose_district = Select(self.driver.find_element_by_id(Data.sr_district))
        choose_block = Select(self.driver.find_element_by_id(Data.sr_block))

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
        self.data.page_loading(self.driver)
        self.logger.info("test_choose_block is completed...")

    def test_choose_cluster(self):
        self.tests.pop()
        self.logger.info("test_choose_cluster is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        choose_district = Select(self.driver.find_element_by_id(Data.sr_district))
        choose_block = Select(self.driver.find_element_by_id(Data.sr_block))
        choose_cluster = Select(self.driver.find_element_by_id(Data.sr_cluster))

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
        self.data.page_loading(self.driver)
        self.logger.info("test_choose_cluster is completed...")

    def test_home_icon(self):
        self.tests.pop()
        self.logger.info("test_home_icon is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        home = Home(self.driver)
        home.click_on_blocks_click_on_home_icon()
        result = home.click_HomeButton()
        if "Semester Report" in result:
            print("Home Icon is Working")
        else:
            raise self.failureException('Home Icon is not working')
        self.data.page_loading(self.driver)
        self.logger.info("test_home_icon is completed...")

    def test_download(self):
        self.tests.pop()
        self.logger.info("test_download is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        element = self.driver.find_element_by_id(Data.sar_download)
        try:
            element.click()
            time.sleep(2)
            print("Download Button is working")
            time.sleep(5)
        except WebDriverException:
            raise self.failureException("Download Button is not working")
        self.data.page_loading(self.driver)
        self.logger.info("test_download is completed...")

    def test_markers_on_map(self):
        self.tests.pop()
        self.logger.info("test_markers_on_map is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        state = GetData()
        state.click_on_state(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        if int(len(dots) - 1) != 0:
            print('Markers are present on the map')
        else:
            raise self.failureException("Markers are not present on the map")
        self.data.page_loading(self.driver)
        self.logger.info("test_markers_on_map is completed...")

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
        self.data.page_loading(self.driver)
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
        self.data.page_loading(self.driver)
        self.logger.info("test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools is completed...")

    def test_home_button(self):
        self.tests.pop()
        self.logger.info("test_home_button is running" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))

        self.driver.find_element_by_id('homeBtn').click()
        time.sleep(2)
        self.data.navigate_to_semester_report()
        if "Semester Report" in self.driver.page_source:
            print("test_home_button is working")
        else:
            raise self.failureException('test_home_button is not working')

        self.logger.info("test_home_button is completed...")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
