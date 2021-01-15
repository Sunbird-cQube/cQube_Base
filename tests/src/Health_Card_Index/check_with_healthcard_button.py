import time

from Data.parameters import Data
from reuse_func import GetData


class Health_card_btn():
    def __init__(self,driver):
        self.driver = driver

    def check_dashboard_health_board(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath("//*[@id='healthCard']").click()
        self.data.page_loading(self.driver)
        if "healthCard" in self.driver.current_url:
            print("Health card report is displayed ")
        else:
            print("Navigation is failed to health card report")
            count = count + 1
        return count

    def check_landing_healthcard_icon(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='healthCard']").click()
        self.data.page_loading(self.driver)
        if "healthCard" in self.driver.current_url:
            print("Health card report is displayed ")
        else:
            print("Navigation is failed to health card report")
            count = count + 1
        return count


