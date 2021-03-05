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
                self.filename = self.p.get_download_dir() + '/' + "District_wise_report_January_2021.csv"
                if os.path.isfile(self.filename) != True:
                    print("Over all time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        schools = 0
                        student = 0
                        for row in csv.reader(fin):
                            schools += int(row[4])
                            student += int(row[3])
                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(sc) != int(schools):
                            print("school count mismatched", int(sc), int(schools))
                            count = count + 1
                        if int(student) != int(std):
                            print("student count mismatched", int(sc), int(schools))
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
                self.filename = self.p.get_download_dir() + '/' + "District_wise_report_January_2021.csv"
                if os.path.isfile(self.filename) != True:
                    print(" Last 7 Days time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        schools = 0
                        student = 0
                        for row in csv.reader(fin):
                            schools += int(row[4])
                            student += int(row[3])
                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(sc) != int(schools):
                            print("school count mismatched", int(sc), int(schools))
                            count = count + 1
                        if int(student) != int(std):
                            print("student count mismatched", int(sc), int(schools))
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
                self.filename = self.p.get_download_dir() + '/' + "District_wise_report_"+self.month+"_"+self.year+".csv"
                if os.path.isfile(self.filename) != True:
                    print(" Last 30 Days time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        schools = 0
                        student = 0
                        for row in csv.reader(fin):
                            schools += int(row[4])
                            student += int(row[3])
                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(sc) != int(schools):
                            print("school count mismatched", int(sc), int(schools))
                            count = count + 1
                        if int(student) != int(std):
                            print("student count mismatched", int(sc), int(schools))
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
                self.filename = self.p.get_download_dir() + '/' + "District_wise_report_"+self.month+"_"+self.year+".csv"
                if os.path.isfile(self.filename) != True:
                    print(" Last Day time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        schools = 0
                        student = 0
                        for row in csv.reader(fin):
                            schools += int(row[4])
                            student +=int(row[3])
                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(sc) != int(schools):
                            print("school count mismatched", int(sc), int(schools))
                            count = count + 1
                        if int(student) != int(std):
                            print("student count mismatched", int(sc), int(schools))
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
                self.filename = self.p.get_download_dir() + '/' + "District_wise_report_"+self.month+"_"+self.year+".csv"
                if os.path.isfile(self.filename) != True:
                    print(" Last Day time series csv file is not downloaded")
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        schools = 0
                        student = 0
                        for row in csv.reader(fin):
                            schools += int(row[4])
                            student += int(row[3])
                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        stds = self.driver.find_element_by_id("students").text
                        std = re.sub('\D', "", stds)
                        if int(sc) != int(schools):
                            print("school count mismatched", int(sc), int(schools))
                            count = count + 1
                        if int(student) != int(std):
                            print("student count mismatched", int(sc), int(schools))
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
                        self.filename = self.p.get_download_dir() + '/' + "District_wise_report_"+month.options[j].text+"_"+year.options[i].text+".csv"
                        print(self.filename)
                        if os.path.isfile(self.filename) != True:
                            print(year.options[i].text,month.options[j].text,"time series csv file is not downloaded")
                        else:
                            with open(self.filename) as fin:
                                csv_reader = csv.reader(fin, delimiter=',')
                                header = next(csv_reader)
                                schools = 0
                                student = 0
                                for row in csv.reader(fin):
                                    schools += int(row[4])
                                    student += int(row[3])
                                school = self.driver.find_element_by_id("schools").text
                                sc = re.sub('\D', "", school)
                                stds = self.driver.find_element_by_id("students").text
                                std = re.sub('\D', "", stds)
                                if int(sc) != int(schools):
                                    print("school count mismatched", int(sc), int(schools))
                                    count = count + 1
                                if int(student) != int(std):
                                    print("student count mismatched", int(sc), int(schools))
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
                cur_schools = self.driver.find_element_by_id(Data.schoolcount).text
                cstudents = re.sub('\D', '', cur_students)
                cschools = re.sub('\D', '', cur_schools)
                blk = self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
                self.data.page_loading(self.driver)
                blk_students = self.driver.find_element_by_id(Data.students).text
                blk_schools = self.driver.find_element_by_id(Data.schoolcount).text

                bstudents = re.sub('\D','',blk_students)
                bschools =re.sub('\D','',blk_schools)

                cls = self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
                self.data.page_loading(self.driver)
                cls_students = self.driver.find_element_by_id(Data.students).text
                cls_schools = self.driver.find_element_by_id(Data.schoolcount).text

                cl_students = re.sub('\D', '', cls_students)
                cl_schools = re.sub('\D', '', cls_schools)

                sc = self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
                self.data.page_loading(self.driver)
                sc_students = self.driver.find_element_by_id(Data.students).text
                sc_schools = self.driver.find_element_by_id(Data.schoolcount).text

                s_students = re.sub('\D', '', sc_students)
                s_schools = re.sub('\D', '', sc_schools)
                count = 0

                if int(cur_schools) != int(bschools):
                    print('Block level mismatch fount footers',cur_schools , bschools)
                    count = count + 1
                if int(cur_students) != int(bstudents):
                    print('Block level mismatch fount footers', cur_students, blk_students)
                    count = count + 1

                if int(cur_schools) != int(cl_schools):
                    print('Cluster level mismatch fount footers', cur_schools, cl_schools)
                    count = count + 1
                if int(cur_students) != int(cl_students):
                    print('Cluster level mismatch fount footers', cur_students, cl_students)
                    count = count + 1

                if int(cur_schools) != int(s_schools):
                    print('School level mismatch fount footers', cur_schools, s_schools)
                    count = count + 1
                if int(cur_students) != int(s_students):
                    print('School level mismatch fount footers', cur_students, s_students)
                    count = count + 1
        return count

