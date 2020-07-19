
from Data.parameters import Data
from reuse_func import GetData


class Clusters():
    def __init__(self, driver):
        self.driver = driver

    def check_markers_on_clusters_map(self):
        self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        return dots