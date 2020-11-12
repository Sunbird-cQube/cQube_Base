from Data.parameters import Data
from reuse_func import GetData


class Diksha_page():
    def __init__(self,driver):
        self.driver = driver

    def test_navigation(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        self.data.navigate_to_diksha_content_course()
        self.data.page_loading(self.driver)
        if "usage-by-course-content" in self.driver.current_url:
            print("Diksha usage-by-textbook-content page is Displayed")
        else:
            print("Diksha usage-by-textbook-content page is not exist ")
            count = count + 1
        self.data.page_loading(self.driver)
        return count

