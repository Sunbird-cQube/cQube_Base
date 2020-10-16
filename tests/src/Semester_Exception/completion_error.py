import os
import time
import unittest
from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class cQube_semester_exception_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_completion_error()
            self.data.page_loading(self.driver)

    def test_completion_page(self):
        self.data.page_loading(self.driver)
        if 'download-missing-data' in self.driver.current_url:
            print("Completion error home page is present ")
        else:
            print('Completion error page is not exists ')
        self.data.page_loading(self.driver)

    def test_downlaod(self):
        p = pwd()
        self.fname = file_extention()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.compl_download).click()
        time.sleep(10)
        self.filename = p.get_download_dir() + "/" + self.fname.completion_error()
        time.sleep(2)
        if os.path.isfile(self.filename) != True:
            print("Completion error csv is not downloaded")
        if os.path.isfile(self.filename) == True:
            print('Completion error csv file is successfully downloaded')
            os.remove(self.filename)
        self.data.page_loading(self.driver)

    def test_homebtn(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        time.sleep(2)
        self.driver.find_element_by_id('isdata').click()
        if 'download-missing-data' in self.driver.current_url:
            print("Completion error home page is present ")
        else:
            print('Completion error page is not exists ')
        self.data.page_loading(self.driver)

    def test_click_logout(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)
        self.assertEqual('Log in to cQube',self.driver.title,msg="Login page is not displayed ")
        self.data.login_cqube(self.driver)
        time.sleep(2)
        self.data.navigate_to_completion_error()
        self.data.page_loading(self.driver)