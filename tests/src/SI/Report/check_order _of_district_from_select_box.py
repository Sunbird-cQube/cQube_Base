
from Data.parameters import Data
from reuse_func import GetData


class check_order_of_tabledata():
    def __init__(self,driver):
        self.driver =driver
    def test_order(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = self.driver.find_elements_by_xpath("//select[@name='myDistrict']/options")
        for i in range(len(dist)):
            print(dist[i].text)
