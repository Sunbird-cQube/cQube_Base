from Data.parameters import Data
from reuse_func import GetData


class completion_percentage_icon():
    def __init__(self ,driver):
        self.driver = driver

    def test_completion_percentage_icon(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        if 'dashboard' in self.driver.current_url:
            print('cQube landing page is displayed')
        else:
            print('Homebtn is not working ')
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='tpd-comp']").click()
        if 'completion' in self.driver.current_url:
            print('TPD Completion percentage report is displayed ')
        else:
            print('TPD Completion percentage icon is not working ')
            count = count + 1
        self.data.page_loading(self.driver)
        return count

    def test_dashboard_completion_report(self):
        count = 0
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        if 'dashboard' in self.driver.current_url:
            print('cQube landing page is displayed')
        else:
            print('Homebtn is not working ')
        self.data.page_loading(self.driver)
        self.data.navigate_to_tpd_completion_percentage()
        self.data.page_loading(self.driver)
        if 'tpd-completion' in self.driver.current_url:
            print("Completion percentage report is displayed")
        else:
            print('Completion percentage report is not present ')
            count = count + 1
        self.data.page_loading(self.driver)
        return count