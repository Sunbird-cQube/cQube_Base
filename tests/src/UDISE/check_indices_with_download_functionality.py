import csv
import os
import time

from selenium.webdriver.support.select import Select

from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class udiseindices_scores():
    def __init__(self,driver):
        self.driver = driver

    def infrastructure_score(self):
        self.cal = GetData()
        self.fname = file_extention()
        self.driver.find_element_by_css_selector('p >span').click()
        self.cal.page_loading(self.driver)
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(1)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("infrastructure_score  is selected and csv file is downloaded")
            return row_count-1


    def administation(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(2)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Administration is selected and csv file is downloaded")
            return row_count - 1

    def artslab(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(3)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("artslab  is selected and csv file is downloaded")
            return row_count - 1

    def community(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(4)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Community  is selected and csv file is downloaded")
            return row_count - 1

    def Enrollment(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(5)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Enrollment  is selected and csv file is downloaded")
            return row_count - 1
    def grant_expenditure(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(6)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Grant expenditure is selected and csv file is downloaded")
            return row_count - 1

    def ictlab(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(7)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("ICTlab  is selected and csv file is downloaded")
            return row_count - 1

    def Medical(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(8)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Medical is selected and csv file is downloaded")
            return row_count - 1

    def nsqf(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(9)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("nsqf is selected and csv file is downloaded")
            return row_count - 1
    def policy(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(10)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Policy is selected and csv file is downloaded")
            return row_count - 1

    def Safety(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(11)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Safety  is selected and csv file is downloaded")
            return row_count - 1

    def School_infrastructure(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(12)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("School infrastructure is selected and csv file is downloaded")
            return row_count - 1

    def School_inspection(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(13)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("school inspection  is selected and csv file is downloaded")
            return row_count - 1

    def School_perfomance(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(14)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("School performance is selected and csv file is downloaded")
            return row_count - 1

    def Science_lab(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(15)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Science lab is selected and csv file is downloaded")
            return row_count - 1

    def Teacher_profile(self):
        chooseinfra = Select(self.driver.find_element_by_id('choose_infra'))
        chooseinfra.select_by_index(16)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id('download').click()
        time.sleep(2)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.udise_district()
        time.sleep(2)
        file = os.path.isfile(self.filename)
        if True != file:
            print('csv file not downloaded')
        else:
            row_count = 0
            with open(self.filename, 'rt')as f:
                reader = csv.reader(f)
                data = list(reader)
                row = len(data)
                row_count = row
            print("Teachers profile is selected and csv file is downloaded")
            return row_count - 1

    def remove_csv(self):
        os.remove(self.filename)
