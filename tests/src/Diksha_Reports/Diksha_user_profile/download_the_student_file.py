import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Diksha_students_download():
    def __init__(self, driver):
        self.driver = driver
        self.filename = ''

    def test_student_file(self):
        self.data = GetData()
        self.p = pwd()
        self.fname =file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        download = Select(self.driver.find_element_by_id('downloader'))
        download.select_by_visible_text(' Student ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + '/' + self.fname.diskha_stack_student()
        file = os.path.isfile(self.filename)
        count = 0
        if not os.path.isfile(self.filename):
            print("Diksha All type data csv file not downloaded")
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                contentplays = 0
                for row in csv.reader(fin):
                    contentplays += int(row[3])
                play_count = self.driver.find_element_by_id('totalCount').text
                pc = re.sub('\D', "", play_count)
            self.data.page_loading(self.driver)
        os.remove(self.filename)
        return file


