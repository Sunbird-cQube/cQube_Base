from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Home_functionalities():
    def __init__(self,driver):
        self.driver = driver

    def test_homeicon_functionality(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeseries = Select(self.driver.find_element_by_id(Data.sar_district))
        timeseries.select_by_index(5)
        self.data.page_loading(self.driver)
        # present = self.driver.find_element_by_id(Data.homeicon).is_Displayed()
        self.driver.find_element_by_id(Data.homeicon).click()
        print('checked with homeicon function is working ')
        self.data.page_loading(self.driver)
        # return  present

    def test_homebtn_funtion(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print('Home button is working ')
        else:
            print('Homebtn is not working ')
            count = count + 1
        self.data.page_loading(self.driver)
        self.data.navigate_to_tpd_enrollment_report()
        self.data.page_loading(self.driver)
        return  count

    def test_hyperlink_function(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        # timeseries = Select(self.driver.find_element_by_name(Data.timeperiods))
        # timeseries.select_by_visible_text(' Last 7 Days ')
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        print("Checked with hyper link function")
        self.data.page_loading(self.driver)


