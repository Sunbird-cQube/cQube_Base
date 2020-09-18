import os
import time

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class SchoolwiseCsv():

    def __init__(self, driver, year, month):
        self.driver = driver
        self.year = year.strip()
        self.month = month.strip()

    def click_download_icon_of_schools(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        p = pwd()
        self.filename = p.get_download_dir() + "/School_wise_report_" + self.month + "_" + self.year + ".csv"
        return os.path.isfile(self.filename)

    def remove_csv(self):
        os.remove(self.filename)
