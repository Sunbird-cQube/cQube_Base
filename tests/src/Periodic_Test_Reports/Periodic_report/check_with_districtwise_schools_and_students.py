import re

from selenium.webdriver.support.select import Select
from reuse_func import GetData


class District_wise_schools_students():
    def __init__(self, driver):
        self.driver = driver

    def check_dots_on_each_districts(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)

            students = self.driver.find_element_by_id("students").text
            res = re.sub('\D', "", students)

            school = self.driver.find_element_by_id("schools").text
            sc = re.sub('\D', "", school)

            if int(res) == 0 :
                print("District" + select_district.first_selected_option.text + "student count mismatched")
                count = count + 1
            if int(sc) == 0:
                print("District" + select_district.first_selected_option.text + "school count mismatched")
                count = count + 1


        return count

