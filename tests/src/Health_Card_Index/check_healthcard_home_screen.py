import time

from Data.parameters import Data
from reuse_func import GetData


class health_card_homepage():

    def __init__(self,driver):
        self.driver = driver

    def check_statelevel_cards_presence(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        cardnames = self.driver.find_elements_by_tag_name('h6')
        counts = len(cardnames)-1
        for i in range(len(cardnames)):
            print(cardnames[i].text)
            self.data.page_loading(self.driver)
        return counts

    def check_card_informations(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        student = self.driver.find_elements_by_xpath(Data.state_student)
        for i in range(len(student)):
            print(student[i].text)

        sem = self.driver.find_elements_by_xpath(Data.state_semester)
        for i in range(len(sem)):
            print(sem[i].text)

        pat = self.driver.find_elements_by_xpath(Data.state_pat)
        for i in range(len(pat)):
            print(pat[i].text)

        udise = self.driver.find_elements_by_xpath(Data.state_udise)
        for i in range(len(udise)):
            print(udise[i].text)

        crc = self.driver.find_elements_by_xpath(Data.state_crc)
        for i in range(len(crc)):
            print(crc[i].text)

    def check_click_to_access_student_report(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_student).click()
        time.sleep(5)
        if 'student-attendance' in self.driver.current_url:
            print("Student Attendance report is displayed ")
        else:
            print("Access to  Student Attendance report is failed ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.report_stdcard).click()
        time.sleep(4)
        if 'healthCard' in self.driver.current_url:
            print("Health card report is displayed")
        else:
            print("Report to health card is failed in student report ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

    def check_click_to_access_sem_report(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_semester).click()
        time.sleep(5)
        if 'semester-report' in self.driver.current_url:
            print("Semester report is displayed ")
        else:
            print("Access to Semester report is failed ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.report_semcard).click()
        time.sleep(4)
        if 'healthCard' in self.driver.current_url:
            print("Health card report is displayed")
        else:
            print("Report to health card is failed in semester report ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

    def check_click_to_access_pat_report(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_pat).click()
        time.sleep(5)
        if 'pat-report' in self.driver.current_url:
            print("pat-report is displayed ")
        else:
            print("Access to pat-report is failed ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.report_patcard).click()
        time.sleep(4)
        if 'healthCard' in self.driver.current_url:
            print("Health card report is displayed")
        else:
            print("Report to health card is failed in pat report ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

    def check_click_to_access_infrastr_report(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_infra).click()
        time.sleep(5)
        if 'school-infra-map' in self.driver.current_url:
            print("school-infra-map is displayed ")
        else:
            print("Access to school-infra-map is failed ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.report_infracard).click()
        time.sleep(4)
        if 'healthCard' in self.driver.current_url:
            print("Health card report is displayed")
        else:
            print("Report to health card is failed in infrastructure report ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

    def check_click_to_access_udise_report(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_udise).click()
        time.sleep(5)
        if 'udise-report' in self.driver.current_url:
            print("udise-report is displayed ")
        else:
            print("Access toudise-report is failed ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.report_udisecard).click()
        time.sleep(4)
        if 'healthCard' in self.driver.current_url:
            print("Health card report is displayed")
        else:
            print("Report to health card is failed in udise report ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

    def check_click_to_access_crc_report(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_crc).click()
        time.sleep(5)
        if 'crc-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to crc-report is failed ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.report_crccard).click()
        time.sleep(4)
        if 'healthCard' in self.driver.current_url:
            print("Health card report is displayed")
        else:
            print("Report to health card is failed in crc report ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

