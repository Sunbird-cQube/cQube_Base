
from Data.parameters import Data
from reuse_func import GetData


class select_blockwise():
    def __init__(self,driver):
        self.driver = driver
    def test_dist_blocks(self):
        self.driver.implicitly_wait(20)
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        Districts = self.driver.find_elements_by_xpath(Data.sc_choosedist)
        blocks = self.driver.find_elements_by_xpath(Data.sc_chooseblock)
        for i in range(1,len(Districts)):
            Districts[i].click()
            print(Districts[i].text)
            self.p.page_loading(self.driver)

