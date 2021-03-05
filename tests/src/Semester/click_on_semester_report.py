
from reuse_func import GetData


class SemesterReport():
    def __init__(self, driver):
        self.driver = driver

    def check_semester_landing_page(self):
        return self.driver.page_source

    # def click_on_semester(self):
    #     cal = GetData()
    #     cal.navigate_to_semester_report()
    #     cal.page_loading(self.driver)
    #     return self.driver.page_source


