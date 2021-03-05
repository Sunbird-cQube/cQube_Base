


from Data.parameters import Data
from reuse_func import GetData


class semester_exception_icon():
    def __init__(self, driver):
        self.driver = driver

    def test_icon(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('SemExp').click()
        self.data.page_loading(self.driver)
        if "sem-exception" in self.driver.current_url:
            print("Semester exception report page is dispayed")
        else:
            print("Semester exception icon is not working")
            count = count + 1
        return count





