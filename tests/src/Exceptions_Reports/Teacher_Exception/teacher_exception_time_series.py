import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class time_series():
    def __init__(self,driver):
        self.driver = driver

    def check_time_series_dropdown(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_id('period'))
        for i in range(1,len(timeperiod.options)):
            timeperiod.select_by_index(i)
            self.data.page_loading(self.driver)
            print(timeperiod.options[i].text ,'is selected and displayed on screen')
            if 'No data found' in self.driver.page_source:
                print(timeperiod.options[i].text ,"is not having Data")
            else:
                markers = self.driver.find_elements_by_xpath(Data.dots)
                dots = len(markers)-1
                if dots == 0:
                    count = count + 1
                    print('Markers are not present on screen')
        return count

    def check_time_series_dropdown_options(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_id('period'))
        count = len(timeperiod.options)-1
        return count

    def check_time_overall_series_dropdown(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiods = Select(self.driver.find_element_by_id('period'))
        timeperiods.select_by_visible_text(' Overall ')
        self.data.page_loading(self.driver)
        if 'No data found' in self.driver.page_source:
            print("Overall is not having Data")
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if markers == 0:
                print('Markers are not present on screen ')
                count = count + 1
            else:
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = self.p.get_download_dir() + '/' + "teacher_attendance_exception_allDistricts_overall_"+self.data.get_current_date()+'.csv'
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print("Over all time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        student = 0
                        for row in csv.reader(fin):
                            student += int(row[2])
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(std) != int(student):
                            print("school count mismatched", int(std), int(student))
                            count = count + 1

                    os.remove(self.filename)
        return count

    def check_time_series_last_7_days(self):
        cal = GetData()
        self.p = pwd()
        count = 0
        self.file = file_extention()
        cal.click_on_state(self.driver)
        timeperiods = Select(self.driver.find_element_by_id('period'))
        timeperiods.select_by_visible_text(' Last 7 Days ')
        cal.page_loading(self.driver)
        if 'No data found' in self.driver.page_source:
            print("Last 7 days is not having Data")
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if markers == 0:
                print('Markers are not present on screen ')
                count = count + 1
            else:
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = self.p.get_download_dir() + '/' + "teacher_attendance_exception_allDistricts_last_7_days_"+cal.get_current_date()+'.csv'
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(" Last 7 Days time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        student = 0
                        for row in csv.reader(fin):
                            student += int(row[2])

                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(student) != int(std):
                            print("missing data count mismatched", int(std), int(student))
                            count = count + 1
                    os.remove(self.filename)
        return count

    def check_time_series_last_30_days(self):
        cal = GetData()
        self.p = pwd()
        count = 0
        self.file = file_extention()
        cal.click_on_state(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        timeperiods = Select(self.driver.find_element_by_id('period'))
        timeperiods.select_by_visible_text(' Last 30 Days ')
        cal.page_loading(self.driver)
        if 'No data found' in self.driver.page_source:
            print("Last 30 days is not having Data")
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if markers == 0:
                print('Markers are not present on screen ')
                count = count + 1
            else:
                cal.page_loading(self.driver)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(5)
                self.filename = self.p.get_download_dir() + '/' + "teacher_attendance_exception_allDistricts_last_30_days_" + cal.get_current_date() + '.csv'
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(" Last 30 Days time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        student = 0
                        for row in csv.reader(fin):
                            student += int(row[2])
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)

                        if int(student) != int(std):
                            print("student count mismatched", int(std), int(student))
                            count = count + 1
                    os.remove(self.filename)
        return count

    def check_time_series_day(self):
        cal = GetData()
        self.p = pwd()
        count = 0
        self.file = file_extention()
        cal.click_on_state(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        timeperiods = Select(self.driver.find_element_by_id('period'))
        timeperiods.select_by_visible_text(' Last Day ')
        cal.page_loading(self.driver)
        if 'No data found' in self.driver.page_source:
            print("Last Day is not having Data")
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if markers == 0:
                print('Markers are not present on screen ')
                count = count + 1
            else:
                cal.page_loading(self.driver)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(5)
                self.filename = self.p.get_download_dir() + '/' + "teacher_attendance_exception_allDistricts_last_day_" +cal.get_current_date() + '.csv'
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(" Last Day time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        student = 0
                        for row in csv.reader(fin):
                            student +=int(row[2])

                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)

                        if int(student) != int(std):
                            print("student count mismatched", int(std), int(student))
                            count = count + 1
                    os.remove(self.filename)
        return count

    def check_time_series_month_and_year(self):
        cal = GetData()
        self.p = pwd()
        count = 0
        self.file = file_extention()
        cal.click_on_state(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        timeperiods = Select(self.driver.find_element_by_id('period'))
        timeperiods.select_by_visible_text(' Year and Month ')
        cal.page_loading(self.driver)
        if 'No data found' in self.driver.page_source:
            print("Year and month is not having Data")
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if markers == 0:
                print('Markers are not present on screen ')
                count = count + 1
            else:
                cal.page_loading(self.driver)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(5)
                self.filename = self.p.get_download_dir() + '/' + "teacher_attendance_exception_allDistricts_"+self.month+"_"+self.year+"_"+cal.get_current_date()+".csv"
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(" year and month time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        student = 0
                        for row in csv.reader(fin):
                            student += int(row[2].replace(',',''))

                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)

                        if int(student) != int(std):
                            print("school missing data count mismatched", int(std), int(student))
                            count = count + 1
                    os.remove(self.filename)
        return count

    def check_year_and_month_dropdowns_csv_download(self):
        cal = GetData()
        self.p = pwd()
        count = 0
        self.file = file_extention()
        cal.click_on_state(self.driver)
        timeperiods = Select(self.driver.find_element_by_id('period'))
        timeperiods.select_by_visible_text(' Year and Month ')
        cal.page_loading(self.driver)
        if 'No data found' in self.driver.page_source:
            print("Year and month is not having Data")
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if markers == 0:
                print('Markers are not present on screen ')
                count = count + 1
            else:
                cal.page_loading(self.driver)
                year = Select(self.driver.find_element_by_id('year'))
                month = Select(self.driver.find_element_by_id('month'))
                for i in range(1,len(year.options)):
                    year.select_by_index(i)
                    cal.page_loading(self.driver)
                    for j in range(1,len(month.options)):
                        month.select_by_index(j)
                        cal.page_loading(self.driver)
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(5)
                        self.filename = self.p.get_download_dir() + '/' +"teacher_attendance_exception_allDistricts_"+(month.options[j].text).replace(' ','')+"_"+(year.options[i].text).replace(' ','')+cal.get_current_date()+".csv"
                        print(self.filename)
                        if os.path.isfile(self.filename) != True:
                            print(year.options[i].text,month.options[j].text,"time series csv file is not downloaded")
                        else:
                            with open(self.filename) as fin:
                                csv_reader = csv.reader(fin, delimiter=',')
                                header = next(csv_reader)
                                student = 0
                                for row in csv.reader(fin):
                                    student += int(row[2].replace(',',''))

                                stds = self.driver.find_element_by_id("students").text
                                std = re.sub('\D', "", stds)

                                if int(student) != int(std):
                                    print("student count mismatched", int(std), int(student))
                                    count = count + 1
                            os.remove(self.filename)
        return count


    def check_select_time_series_and_click_on_block_cluster_school_btns(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_id('period'))
        for i in range(1, len(timeperiod.options)):
            timeperiod.select_by_index(i)
            self.data.page_loading(self.driver)
            print(timeperiod.options[i].text, 'is selected and displayed on screen')
            if 'No data found' in self.driver.page_source:
                print(timeperiod.options[i].text ,"is not having Data")
            else:
                cur_students = self.driver.find_element_by_id(Data.students).text
                cstudents = re.sub('\D', '', cur_students)

                blk = self.driver.find_element_by_id(Data.sr_block_btn).click()
                self.data.page_loading(self.driver)

                blk_students = self.driver.find_element_by_id(Data.students).text
                bstudents = re.sub('\D','',blk_students)

                cls = self.driver.find_element_by_id(Data.sr_cluster_btn).click()
                self.data.page_loading(self.driver)
                time.sleep(5)
                cls_students = self.driver.find_element_by_id(Data.students).text

                cl_students = re.sub('\D', '', cls_students)

                sc = self.driver.find_element_by_id(Data.sr_schools_btn).click()
                self.data.page_loading(self.driver)
                time.sleep(10)
                sc_students = self.driver.find_element_by_id(Data.students).text

                s_students = re.sub('\D', '', sc_students)
                count = 0

                if int(cstudents) != int(bstudents):
                    print('Block level mismatch found at footers', cur_students, blk_students)
                    count = count + 1


                if int(cstudents) != int(cl_students):
                    print('Cluster level mismatch found at footers', cur_students, cl_students)
                    count = count + 1


                if int(cstudents) != int(s_students):
                    print('School level mismatch found at footers', cur_students, s_students)
                    count = count + 1
        return count

