

from Data.parameters import Data
from reuse_func import GetData


class click_on_reportmap():
    def __init__(self,driver):
        self.driver =driver
    def test_reportmap(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.p.page_loading(self.driver)
        text = self.driver.find_element_by_tag_name("h4").text
        self.driver.find_element_by_xpath(Data.School_infra).click()
        self.driver.find_element_by_id(Data.Reportmap).click()
        self.p.page_loading(self.driver)
        if "school-infra-map" in self.driver.current_url:
            print("Shool infrastructure report page")
        else:
            print("School infrastructure report page is not exist")
        self.p.page_loading(self.driver)
        return text
