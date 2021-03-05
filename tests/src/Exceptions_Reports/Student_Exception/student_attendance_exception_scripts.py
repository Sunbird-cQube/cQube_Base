import csv
import os
import re
import time

from selenium.common.exceptions import ElementClickInterceptedException, NoSuchElementException
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Student_Exceptions():

    def __init__(self,driver,year,month):
        self.driver = driver
        self.year = year.strip()
        self.month = month.strip()
        self.school_count = ''
        self.student_count = ''



    def click_on_sar_exception(self):
        try:
            cal = GetData()
            cal.click_on_state(self.driver)
            cal.page_loading(self.driver)
            cal.navigate_to_student_exception()
            cal.page_loading(self.driver)
            return self.driver.current_url

        except ElementClickInterceptedException:
            print("Element not found and test failed")

    def dashboard_sar_exception(self):
        cal = GetData()
        count = 0
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        cal.page_loading(self.driver)
        cal.navigate_to_student_exception()
        time.sleep(3)
        if 'student-attendance-exception' in self.driver.current_url:
            print("Student exception report is displayed")
        else:
            print('Navigation from dashboard to sar exception is failed')
            count = count + 1
        return count

    def check_markers_on_block_map(self):
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal = GetData()
        count = 0
        cal.page_loading(self.driver)
        self.year,self.month= cal.get_student_month_and_year_values()
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        p = pwd()
        self.filename = p.get_download_dir() + "/student_attendance_exception_allBlocks_"+self.month + "_" + self.year+'_'+cal.get_current_date() + ".csv"
        print(self.filename)
        if os.path.isfile(self.filename) != True:
            return "Block wise csv file not downloaded"
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                missing = 0
                for row in csv.reader(fin):
                    missing += int(row[4])
                misdata = self.driver.find_element_by_id("students").text
                res = re.sub('\D', "", misdata)

                if int(res) !=int(missing):
                    print("Number of schools with missing data count mismatched")
                    count = count + 1
            os.remove(self.filename)
        return count

    def check_markers_on_clusters_map(self):
        self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(5)
        count = 0
        self.year,self.month = cal.get_student_month_and_year_values()
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        p = pwd()
        self.filename = p.get_download_dir() + "/student_attendance_exception_allClusters_" + self.month + "_" + self.year+'_'+cal.get_current_date()+ ".csv"
        print(self.filename)
        if os.path.isfile(self.filename) != True:
            return "Cluster wise csv file not downloaded"
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                missing = 0
                for row in csv.reader(fin):
                    missing += int(row[6])
                misdata = self.driver.find_element_by_id("students").text
                res = re.sub('\D', "", misdata)

                if int(res) != int(missing):
                    print("Number of schools with missing data count mismatched")
                    count = count + 1
            os.remove(self.filename)
        return count

    def check_markers_on_schools_map(self):
        self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
        cal = GetData()
        time.sleep(2)
        cal.page_loading(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        result = self.driver.find_elements_by_class_name(Data.dots)
        time.sleep(5)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        count=0
        p = pwd()
        self.filename = p.get_download_dir() + "/student_attendance_exception_allSchools_" + self.month + "_" + self.year+'_'+cal.get_current_date()+ ".csv"
        print(self.filename)
        if os.path.isfile(self.filename) != True:
            return "School wise csv file not downloaded"
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                missing = 0
                for row in csv.reader(fin):
                    missing += int(row[8])
                misdata = self.driver.find_element_by_id("students").text
                res = re.sub('\D', "", misdata)

                if int(res) != int(missing):
                    print("Number of schools with missing data count mismatched")
                    count = count + 1
            os.remove(self.filename)
        return count

    def click_on_logout(self):
        self.driver.find_element_by_id(Data.Logout).click()
        return self.driver.title

    def click_on_hyperlinks(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_id("choose_dist"))
        dist.select_by_index(1)
        cal.page_loading(self.driver)
        block = Select(self.driver.find_element_by_id("choose_block"))
        block.select_by_index(1)
        cal.page_loading(self.driver)
        cluster = Select(self.driver.find_element_by_id("choose_cluster"))
        cluster.select_by_index(1)
        cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.sr_school_hyper).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.sr_cluster_hyper).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.sr_dist_hyper).click()
        cal.page_loading(self.driver)
        result1 = self.driver.find_element_by_id('choose_block').is_displayed()
        result2 = self.driver.find_element_by_id('choose_cluster').is_displayed()
        dist = Select(self.driver.find_element_by_id('choose_dist'))
        choose_dist = dist.first_selected_option.text
        return result1, result2, choose_dist

    def click_download_icon_of_district(self):
        cal = GetData()
        count = 0
        time.sleep(5)
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + "student_attendance_exception_allDistricts_overall_"+cal.get_current_date()+".csv"
        print(self.filename)
        if not os.path.isfile(self.filename):
            print("Districtwise csv is not downloaded")
            count = count + 1
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                missing = 0
                for row in csv.reader(fin):
                    missing += int(row[2])
                misdata = self.driver.find_element_by_id("students").text
                res = re.sub('\D', "", misdata)

                if int(res) != int(missing):
                    print("Number of schools with missing data count mismatched")
                    count = count + 1
            os.remove(self.filename)
        return count

    global school_count

    def block_no_of_schools(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        no_schools = self.driver.find_element_by_id(Data.students).text
        schools = re.sub("\D", "", no_schools)
        self.school_count = schools
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal.page_loading(self.driver)
        Bschools = self.driver.find_element_by_id(Data.students).text
        Bschools = re.sub("\D", "", Bschools)
        return self.school_count, Bschools

    def cluster_no_of_schools(self):
        self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(15)
        Cschools = self.driver.find_element_by_id(Data.students).text
        Cschools = re.sub("\D", "", Cschools)
        return self.school_count, Cschools

    def schools_no_of_schools(self):
        try:
            self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
            cal = GetData()
            cal.page_loading(self.driver)
            time.sleep(15)
            Sschools = self.driver.find_element_by_id(Data.students).text
            Sschools = re.sub("\D", "", Sschools)
            return self.school_count, Sschools
        except NoSuchElementException:
            print("Element Not Found")

    global student_count

    def block_total_no_of_students(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        total_students = self.driver.find_element_by_id(Data.students).text
        students = re.sub("\D", "", total_students)
        self.student_count = students
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal.page_loading(self.driver)
        Bstudents = self.driver.find_element_by_id(Data.students).text
        Bstudent = re.sub("\D", "", Bstudents)
        return self.student_count, Bstudent

    def cluster_total_no_of_students(self):
        self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(20)
        Cstudents = self.driver.find_element_by_id(Data.students).text
        Cstudent = re.sub("\D", "", Cstudents)
        return self.student_count, Cstudent

    def schools_total_no_of_students(self):
        self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(20)
        Sstudents = self.driver.find_element_by_id(Data.students).text
        Sstudent = re.sub("\D", "", Sstudents)
        return self.student_count, Sstudent



    def click_HomeButton(self):
        count = 0
        self.driver.find_element_by_id(Data.home).click()
        cal = GetData()
        if 'dashboard' in self.driver.current_url:
            print('Homebutton is working')
        else:
            print('Home button is not working')
            count = count + 1
        cal.page_loading(self.driver)
        cal.navigate_to_student_exception()
        return count,self.driver.current_url

    def click_on_blocks_click_on_home_icon(self):
        cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        cal.page_loading(self.driver)
        return  self.driver.page_source

    def check_districts_csv_download(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            value = self.driver.find_element_by_name('myDistrict').get_attribute('value')
            value = value[3:]+'_'
            markers = self.driver.find_elements_by_class_name(Data.dots)
            if len(markers) - 1 == 0:
                print("District" + select_district.first_selected_option.text + "no data")
                count = count + 1
            time.sleep(2)
            self.driver.find_element_by_id('download').click()
            time.sleep(2)
            p = pwd()
            self.filename = p.get_download_dir() + "/student_attendance_exception_Blocks_of_district_"+value.strip()+ self.month + "_" + self.year+'_'+cal.get_current_date() + ".csv"
            print(self.filename)
            if not os.path.isfile(self.filename):
                print("District" + select_district.first_selected_option.text + "csv is not downloaded")
                count = count + 1
            else:
                with open(self.filename) as fin:
                    csv_reader = csv.reader(fin, delimiter=',')
                    header = next(csv_reader)
                    missing = 0
                    for row in csv.reader(fin):
                        missing += int(row[4])
                    misdata = self.driver.find_element_by_id("students").text
                    res = re.sub('\D', "", misdata)

                    if int(res) != int(missing):
                        print("Number of schools with missing data count mismatched")
                        count = count + 1
                os.remove(self.filename)
        return count

    def check_blockwise_csv_download(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.year,self.month = cal.get_student_month_and_year_values()
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                value = self.driver.find_element_by_name('myBlock').get_attribute('value')
                value = value[3:]+'_'
                time.sleep(2)
                markers = self.driver.find_elements_by_class_name(Data.dots)
                if len(markers) - 1 == 0:
                    print(
                        "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "No Data")
                    count = count + 1
                time.sleep(2)
                self.driver.find_element_by_id('download').click()
                time.sleep(5)
                p = pwd()
                self.filename = p.get_download_dir() + "/student_attendance_exception_Clusters_of_block_"+value.strip()+ self.month + "_" + self.year+"_"+cal.get_current_date()+ ".csv"
                print(self.filename)
                if not os.path.isfile(self.filename):
                    print(
                        "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "csv is not downloaded")
                    count = count + 1
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        missing = 0
                        for row in csv.reader(fin):
                            missing += int(row[6])
                        misdata = self.driver.find_element_by_id("students").text
                        res = re.sub('\D', "", misdata)

                        if int(res) != int(missing):
                            print("Number of schools with missing data count mismatched")
                            count = count + 1
                    os.remove(self.filename)
                return count

    def check_clusterwise_csv_download(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.year, self.month = cal.get_student_month_and_year_values()
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                time.sleep(2)
                for z in range(1,len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    value = self.driver.find_element_by_name('myCluster').get_attribute('value')
                    value = value[3:]+'_'
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 == 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "No Data")
                        count = count + 1
                    time.sleep(2)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(5)
                    p = pwd()
                    self.filename = p.get_download_dir() + "/student_attendance_exception_schools_of_cluster_"+value.strip()+ self.month + "_" + self.year+"_"+cal.get_current_date()+ ".csv"
                    print(self.filename)
                    if not os.path.isfile(self.filename):
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "csv is not downloaded")
                        count = count + 1
                    else:
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            missing = 0
                            for row in csv.reader(fin):
                                missing += int(row[8])
                            misdata = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", misdata)

                            if int(res) != int(missing):
                                print("Number of schools with missing data count mismatched")
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
        markers = self.driver.find_elements_by_class_name(Data.dots)
        dots = len(markers) - 1
        if markers == 0:
            print('Markers are not present on screen ')
            count = count + 1
        else:
            cal.page_loading(self.driver)
            year = Select(self.driver.find_element_by_id('year'))
            month = Select(self.driver.find_element_by_id('month'))
            for i in range(1, len(year.options)):
                year.select_by_index(i)
                cal.page_loading(self.driver)
                for j in range(1, len(month.options)):
                    month.select_by_index(j)
                    cal.page_loading(self.driver)
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(5)
                    self.filename = self.p.get_download_dir() + '/'+"student_attendance_exception_allDistricts_"+month.options[j].text +"_"+year.options[i].text+".csv"
                    print(self.filename)
                    if os.path.isfile(self.filename) != True:
                        print(year.options[i].text, month.options[j].text, "time series csv file is not downloaded")
                    else:
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            student = 0
                            for row in csv.reader(fin):
                                student += int(row[3])

                            stds = self.driver.find_element_by_id("students").text
                            std = re.sub('\D', "", stds)

                            if int(student) != int(std):
                                print("no of missing data count mismatched", int(std), int(student))
                                count = count + 1
                        os.remove(self.filename)
        return count

