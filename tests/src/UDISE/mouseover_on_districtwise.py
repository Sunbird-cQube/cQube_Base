
from Data.parameters import Data
from reuse_func import GetData


class mouseover_on_map():
    def __init__(self,driver):
        self.driver = driver
    def test_mousehover(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        markers = self.driver.find_elements_by_class_name(Data.dots)
        count = len(markers)-1
        print("Mousehover on each markers..")
        self.p.test_mouse_over()
        self.p.page_loading(self.driver)
        return count