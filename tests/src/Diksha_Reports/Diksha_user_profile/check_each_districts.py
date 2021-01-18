import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class district_list():
    def __init__(self,driver):
        self.driver = driver

    def test_each_districts(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        districts  =Select(self.driver.find_element_by_id('choose_dist'))
        for x in range(len(districts.options)-3,len(districts.options)):
            time.sleep(1)
            districts.select_by_index(x)
            self.data.page_loading(self.driver)
            c_plays = self.driver.find_element_by_id('totalCount').text
            pc = re.sub('\D', "",c_plays)
            if c_plays == 0 :
                print(districts.options[x].text ," has no content plays records")
                count = count + 1
        self.data.page_loading(self.driver)
        return count
