import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Districtwise_overall_chart():
    def __init__(self,driver):
        self.driver = driver

    def test_each_districts(self):
        self.data = GetData()
        self.driver.implicitly_wait(50)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        times = Select(self.driver.find_element_by_name('timePeriod'))
        times.select_by_visible_text(' Last Day ')
        time.sleep(2)
        districts  =Select(self.driver.find_element_by_id('choose_dist'))
        count = len(districts.options) - 1
        for x in range(len(districts.options)-3,len(districts.options)):
            time.sleep(1)
            districts.select_by_index(x)
            time.sleep(3)
            if " No Data Available " in self.driver.page_source:
                print(districts.options[x].text ," is not contains  data chart " )
                # count = count + 1
            c_plays = self.driver.find_element_by_id('totalCount').text
            pc = re.sub('\D', "", c_plays)
            if c_plays == 0:
                print(districts.options[x].text, " has no content plays records")
                count = count + 1

        self.data.page_loading(self.driver)
        return count
