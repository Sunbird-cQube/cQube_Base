import os
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class download_district_wise_csv():
    def __init__(self,driver):
        self.driver =driver

    def test_districtwise(self):
        self.cal = GetData()
        self.driver.implicitly_wait(20)  # seconds
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        p =pwd()
        District_wise=Select(self.driver.find_element_by_name("downloadType"))
        District_wise.select_by_index(1)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        self.cal.page_loading(self.driver)
        self.filename = p.get_download_dir() + "/Dist_level_Infra_Report.csv"
        self.cal.page_loading(self.driver)
        return os.path.isfile(self.filename)


    def remove_file(self):
        os.remove(self.filename)

