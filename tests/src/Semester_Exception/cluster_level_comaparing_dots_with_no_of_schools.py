import re

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class ClusterDotsWithNoData():
    def __init__(self, driver):
        self.driver = driver

    def comapre_cluster(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        select_block = Select(self.driver.find_element_by_id('choose_block'))
        select_cluster = Select(self.driver.find_element_by_id('choose_cluster'))
        count = 0
        for x in range(len(select_district.options)-1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    if 'No data found' in self.driver.page_source:
                        print(select_district.options[x].text , select_block.options[y].text,select_cluster.options[z].text + "ha no data on map ")
                        count = count + 1
                    else:
                        list = self.driver.find_elements_by_class_name(Data.dots)
                        elem = self.driver.find_element_by_id('schools').text
                        res = re.sub("\D", "", elem)
                        if int(len(list) - 1) != int(res):
                            count = count + 1
                            print(
                                "total no of data not recieved and number of dots are mis matched at" + " " + select_district.first_selected_option.text + " " + select_block.first_selected_option.text + " " + select_cluster.first_selected_option.text)
        return count
