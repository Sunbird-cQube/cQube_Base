
from reuse_func import GetData


class click_on_hyperlink():
    def __init__(self,driver):
        self.driver = driver

    def test_link(self):
        self.p = GetData()
        self.driver.implicitly_wait(10)
        self.driver.find_element_by_css_selector('p >span').click()
        self.p.page_loading(self.driver)
