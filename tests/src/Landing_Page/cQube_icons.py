from Data.parameters import Data
from reuse_func import GetData


class cQube_landing_page():
    def __init__(self,driver):
        self.driver = driver

    def test_SAR(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("sar").click()
        self.cal.page_loading(self.driver)
        if "attendance-report" in self.driver.current_url:
            print("Navigated to Student attendance report")
        else:
            print("Student attendance report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_CRC(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='crcr']/img").click()
        self.cal.page_loading(self.driver)
        if "crc-report" in self.driver.current_url:
            print("Navigated to  CRC report")
        else:
            print("CRC report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_Semester(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='sr']/img").click()
        self.cal.page_loading(self.driver)
        if "semester-report" in self.driver.current_url:
            print("Navigated to  Semester report")
        else:
            print("Semester report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_TAR(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='tar']/img").click()
        self.cal.page_loading(self.driver)
        if "teacher-attendance" in self.driver.current_url:
            print("Navigated to  Teacher coming soon page ")
        else:
            print(" Teacher coming soon page is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_school_map(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("imr").click()
        self.cal.page_loading(self.driver)
        if "school-infra-map" in self.driver.current_url:
            print("Navigated to  School infrastructure map based report")
        else:
            print("School infra map based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_school_chart(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("icr").click()
        self.cal.page_loading(self.driver)
        if "school-infrastructure" in self.driver.current_url:
            print("Navigated to  School infrastructure chart based report")
        else:
            print("School infra chart based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

