import os
import time


from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class download_icon():
    def __init__(self,driver):
        self.driver = driver

    def test_donwload(self):
        self.p =GetData()
        cal = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filenmae = cal.get_download_dir() + '/Dist_wise_report.csv'
        self.p.page_loading(self.driver)
        file = os.path.isfile(self.filenmae)
        self.p.page_loading(self.driver)
        if True == file:
            print('Districtwise file downloaded')
        return file
    def remove_file(self):
        os.remove(self.filenmae)

