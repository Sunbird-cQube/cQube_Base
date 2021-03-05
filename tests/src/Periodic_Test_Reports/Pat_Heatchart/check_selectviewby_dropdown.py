


from selenium.webdriver.support.select import Select
from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData

class exams_series():
    def __init__(self ,driver):
        self.driver = driver

    def exams_dates(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        examdates = Select(self.driver.find_element_by_id(Data.view_by))
        for i in range(1, len(examdates.options)):
            examdates.select_by_index(i)
            self.load.page_loading(self.driver)