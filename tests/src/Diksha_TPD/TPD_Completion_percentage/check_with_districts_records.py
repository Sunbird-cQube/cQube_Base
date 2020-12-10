import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Check_with_all_districts():
    def __init__(self,driver):
        self.driver = driver

    def test_district_selectbox(self):
        self.driver.implicitly_wait(200)
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        districts = Select(self.driver.find_element_by_id(Data.sar_district))
        collections =Select(self.driver.find_element_by_id(Data.coll_names))
        coll_count = len(collections.options)-1
        for i in range(1,len(districts.options)):
            districts.select_by_index(i)
            name = (districts.options[i].text)
            dname =name.strip()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + "/TPD_data_of_district_"+dname.replace(' ','_')+".csv"
            if os.path.isfile(self.filename) != True:
                print(districts.options[i].text,'csv file is not downloaded')
                count = count + 1
            self.data.page_loading(self.driver)
            os.remove(self.filename)
            for j in range(len(collections.options)-2,len(collections.options)):
                collections.select_by_index(j)
                self.data.page_loading(self.driver)

        return count,coll_count

