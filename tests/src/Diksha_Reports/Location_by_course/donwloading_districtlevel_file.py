import csv
import os
import re
import time

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class overalldownload():
    def __init__(self,driver):
        self.driver = driver

    def download_csv_file(self):
        self.data = GetData()
        count = 0
        p = pwd()
        fname = file_extention()
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() + '/' + fname.location_course()
        self.data.page_loading(self.driver)
        if os.path.isfile(self.filename) == False:
            print('Diksha usage by textbook chart csv file is not downloded ')
            count = count + 1
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                contents = 0
                for row in csv.reader(fin):
                    contents += int(row[0])
                total = self.driver.find_element_by_id("totalCount").text
                usage = re.sub('\D', "", total).replace(',','')
                if int(contents) != int(usage):
                    print('Total content usage mis match found')
                    count = count + 1
                os.remove(self.filename)
        return count

