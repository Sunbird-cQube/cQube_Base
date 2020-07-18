import time


from Data.parameters import Data

from get_dir import pwd
from reuse_func import GetData


class plot_values():
    def __init__(self,driver):
        self.driver =driver

    def test_plots(self):
        self.driver.implicitly_wait(30)
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        xaxis_lists = self.driver.find_elements_by_xpath(Data.xaxis)
        yaxis_lists = self.driver.find_elements_by_xpath(Data.yaxis)
        count = len(xaxis_lists)-1
        for i in range(len(xaxis_lists)):
            time.sleep(2)
            xaxis_lists[i].click()
            self.p.page_loading(self.driver)
        for j in range(len(yaxis_lists)):
                time.sleep(2)
                yaxis_lists[j].click()
                self.p.page_loading(self.driver)
        self.p.page_loading(self.driver)
        return count
