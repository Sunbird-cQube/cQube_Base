from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Home_functions():
    def __init__(self,driver):
        self.driver = driver

    def test_homeicons(self):
        self.load =GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        timeseries = Select(self.driver.find_element_by_id(Data.timeperiods))
        timeseries.select_by_index(2)
        self.load.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        self.load.page_loading(self.driver)


    def test_homebutton(self):
        self.load = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.load.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='tpd-tp']").click()
        self.load.page_loading(self.driver)
        if 'tpd-teacher-percentage' in self.driver.current_url:
            print('LPD Percentage progress chart is present ')
        else:
            print('LPD Percentage progress chart is not present in report')
            count = count + 1
        self.load.page_loading(self.driver)
        return count