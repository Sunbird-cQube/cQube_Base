
from selenium.common import exceptions

from Data.parameters import Data
from reuse_func import GetData


class check_schoolinfra_report():
    def __init__(self,driver):
        self.driver = driver

    def test_report(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        try:
            self.driver.find_element_by_id(Data.Dashboard).click()
            self.p.page_loading(self.driver)
            text = self.driver.find_element_by_id(Data.Dashboard).text
            print(text)
            self.driver.find_element_by_xpath(Data.School_infra).click()
            self.p.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Report).click()
            self.p.page_loading(self.driver)
            if "school-infrastructure" in self.driver.current_url:
                print("Shool infrastructure report page")
            else:
                print("School infrastructure report page is not exist")
            return text
        except exceptions.NoSuchElementException:
            print("school infra report page is present on screen")
            self.p.page_loading(self.driver)
