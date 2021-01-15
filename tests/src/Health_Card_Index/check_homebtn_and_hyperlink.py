import time


from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Home_functionalities():
    def __init__(self,driver):
        self.driver = driver


    def test_homebtn_funtion(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print('Home button is working ')
        else:
            print('Homebtn is not working ')
            count = count + 1
        self.data.page_loading(self.driver)
        self.data.navigate_to_health_card_index()
        self.data.page_loading(self.driver)
        return  count

    def test_hyperlink_function(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)

        self.driver.find_element_by_xpath(Data.hyper_link).click()
        print("Checked with hyper link function")
        time.sleep(3)
        self.data.page_loading(self.driver)

    # def test_access_to_all_reports(self):

