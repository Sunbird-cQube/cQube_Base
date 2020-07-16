

from Data.parameters import Data
from reuse_func import GetData


class check_with_table():

    def __init__(self,driver):
        self.driver = driver

    def test_graph_and_table_present_on_school_infra(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
