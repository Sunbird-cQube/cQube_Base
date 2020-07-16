
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class click_on_infrascores():
    def __init__(self,driver):
        self.driver=driver
    def test_infrascores(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        count = len(chooseinfra.options)-1
        self.p.page_loading(self.driver)
        for x in range(1, len(chooseinfra.options)):
            chooseinfra.select_by_index(x)
            self.p.page_loading(self.driver)
        return count