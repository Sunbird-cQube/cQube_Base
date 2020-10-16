import os
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class download_district_wise_csv():
    def __init__(self,driver):
        self.driver =driver

    def test_districtwise(self):
        self.cal = GetData()
        self.fname = file_extention()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        p =pwd()
        District_wise=Select(self.driver.find_element_by_name("downloadType"))
        District_wise.select_by_index(1)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download_scator).click()
        self.cal.page_loading(self.driver)
        self.filename = p.get_download_dir() + "/" + self.fname.sc_district()
        self.cal.page_loading(self.driver)
        return os.path.isfile(self.filename)


    def remove_file(self):
        os.remove(self.filename)

