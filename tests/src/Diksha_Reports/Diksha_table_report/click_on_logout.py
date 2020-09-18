
from Data.parameters import Data
from reuse_func import GetData


class Diksha_logout():
    def __init__(self,driver):
        self.driver = driver

    def test_logout(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        loginpage = self.driver.title
        self.data.login_cqube(self.driver)
        self.data.navigate_to_diksha_table()
        self.data.page_loading(self.driver)
        return loginpage
