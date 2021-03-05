import time

from Data.parameters import Data
from reuse_func import GetData


class logout_button():
    def __init__(self,driver):
        self.driver = driver

    def click_on_logout_btn(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)
        if 'Log in to cQube' in self.driver.title:
            print('Logout button is working ')
        else:
            print('Logout is not working')
            count = count + 1
        self.data.login_cqube(self.driver)
        time.sleep(2)
        self.data.navigate_to_tpd_enrollment_report()
        self.data.page_loading(self.driver)
        return count