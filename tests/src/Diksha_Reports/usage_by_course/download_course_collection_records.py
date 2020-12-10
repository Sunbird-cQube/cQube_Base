import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class course_records_download():

    def __init__(self, driver):
        self.driver = driver
        self.filename = ''

    def test_download_csv(self):
        self.data = GetData()
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        colltype = Select(self.driver.find_element_by_name('collection_type'))
        colltype.select_by_visible_text(' Course ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        self.filename = self.p.get_download_dir() + '/collectionType_course_data.csv'
        time.sleep(2)
        file = os.path.isfile(self.filename)
        os.remove(self.filename)
        return file


