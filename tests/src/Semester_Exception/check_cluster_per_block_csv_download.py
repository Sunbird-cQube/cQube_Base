import os
import time

from selenium.webdriver.support.select import Select

from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class ClusterPerBlockCsvDownload():
    def __init__(self, driver):
        self.driver = driver
        self.filename =''

    def check_csv_download(self):
        cal = GetData()
        self.fname = file_extention()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        select_block = Select(self.driver.find_element_by_id('choose_block'))
        count = 0
        for x in range(len(select_district.options)-1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                time.sleep(2)
                self.driver.find_element_by_id('download').click()
                time.sleep(4)
                p= pwd()
                self.filename = p.get_download_dir() + "/" + self.fname.exception_blockwise()
                if os.path.isfile(self.filename) != True:
                    print("District" + select_district.first_selected_option.text + "Block " + select_block.first_selected_option.text   + "csv is not downloaded")
                    count = count + 1
                if os.path.isfile(self.filename) == True:
                    os.remove(self.filename)

        return count








