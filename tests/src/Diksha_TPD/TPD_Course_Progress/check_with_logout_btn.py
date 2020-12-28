from Data.parameters import Data
from reuse_func import GetData


class logout_button():
    def __init__(self,driver):
        self.driver = driver

    def test_logoutbtn(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        if 'Log in to cQube' in self.driver.title:
            print("Logout button is working ")
        else:
            print("Logout button is not working ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_tpd_content_progress()
        self.data.page_loading(self.driver)
        return count