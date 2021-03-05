import os

from selenium.webdriver.support.select import Select

from get_dir import pwd
from reuse_func import GetData


class blocklevel_csv():
    def __init__(self,driver):
        self.driver =driver
        self.filename=''
    def test_each_district(self):
        self.p = GetData()
        self.driver.find_element_by_css_selector('p >span').click()
        self.p.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        p = pwd()
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.p.page_loading(self.driver)
            self.driver.find_element_by_id('download').click()
            self.p.page_loading(self.driver)
            self.filename = p.get_download_dir() + "/blockPerDistrict_report.csv"
            if os.path.isfile(self.filename) != True:
                print("District" + select_district.first_selected_option.text + "csv is not downloaded")
                count = count + 1
            if os.path.isfile(self.filename) == True:
                os.remove(self.filename)
            self.p.page_loading(self.driver)
        return count


