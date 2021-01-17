import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from reuse_func import GetData


class Access_to_all_Reports():
    def __init__(self,driver):
        self.driver = driver

    def check_with_districts_school_infrastructure_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_infra).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'school-infra-map' in self.driver.current_url:
            print("School infrastructure map report is displayed ")
        else:
            print("Access to School infra report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_districts_student_attendance_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_student).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'student-attendance' in self.driver.current_url:
            print("Student Attendance report is displayed ")
        else:
            print("Access to  Student Attendance report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_districts_semester_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_semester).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'semester-report' in self.driver.current_url:
            print("semester-report is displayed ")
        else:
            print("Access to semester-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_districts_pat_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_pat).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'pat-report' in self.driver.current_url:
            print("pat-report is displayed ")
        else:
            print("Access to pat-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_districts_crc_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_crc).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'crc-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to crc-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_districts_udise_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_udise).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'udise-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to udise-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    #Blockwise
    def check_with_blocks_school_infrastructure_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_b2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_infra).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'school-infra-map' in self.driver.current_url:
            print("School infrastructure map report is displayed ")
        else:
            print("Access to School infra report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_blocks_student_attendance_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_b2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_student).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'student-attendance' in self.driver.current_url:
            print("Student Attendance report is displayed ")
        else:
            print("Access to  Student Attendance report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_block_semester_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_b2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_semester).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'semester-report' in self.driver.current_url:
            print("semester-report is displayed ")
        else:
            print("Access to semester-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_block_pat_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_b2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_pat).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'pat-report' in self.driver.current_url:
            print("pat-report is displayed ")
        else:
            print("Access to pat-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_block_crc_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_b2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_crc).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'crc-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to crc-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_block_udise_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_b2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_udise).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'udise-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to udise-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    # Clusterwise
    def check_with_clusters_school_infrastructure_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_c2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_infra).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'school-infra-map' in self.driver.current_url:
            print("School infrastructure map report is displayed ")
        else:
            print("Access to School infra report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_clusters_student_attendance_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_c2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_student).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'student-attendance' in self.driver.current_url:
            print("Student Attendance report is displayed ")
        else:
            print("Access to  Student Attendance report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_clusters_semester_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_c2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_semester).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'semester-report' in self.driver.current_url:
            print("semester-report is displayed ")
        else:
            print("Access to semester-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_clusters_pat_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_c2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_pat).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'pat-report' in self.driver.current_url:
            print("pat-report is displayed ")
        else:
            print("Access to pat-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_clusters_crc_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_c2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_crc).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'crc-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to crc-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_clusters_udise_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_c2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_udise).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'udise-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to udise-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

        # Schools
    def check_with_school_school_infrastructure_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_infra).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'school-infra-map' in self.driver.current_url:
            print("School infrastructure map report is displayed ")
        else:
            print("Access to School infra report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_schools_student_attendance_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_student).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'student-attendance' in self.driver.current_url:
            print("Student Attendance report is displayed ")
        else:
            print("Access to  Student Attendance report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_schools_semester_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_semester).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'semester-report' in self.driver.current_url:
            print("semester-report is displayed ")
        else:
            print("Access to semester-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_schools_pat_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_pat).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'pat-report' in self.driver.current_url:
            print("pat-report is displayed ")
        else:
            print("Access to pat-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_schools_crc_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_crc).click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        if 'crc-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to crc-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count

    def check_with_schools_udise_report(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.access_udise).click()
        self.data.page_loading(self.driver)
        time.sleep(3)
        if 'udise-report' in self.driver.current_url:
            print("crc-report is displayed ")
        else:
            print("Access to udise-report is failed ")
            count = count + 1
        self.driver.back()
        self.data.page_loading(self.driver)
        if dnames.health_card_d1_name() in self.driver.current_url:
            print("Reverting back to health card page is displayed ")
        else:
            print("Failed in revert back from report page to health card page ")
            count = count + 1
        return count
