import os
import time
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.select import Select

from Data.parameters import Data


class cqube():
    def __init__(self, driver):
        self.driver = driver

    def open_cqube_appln(self):
        self.driver.maximize_window()
        self.driver.implicitly_wait(20)
        self.driver.get(Data.url)

    def login_cqube(self):
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.email).send_keys(Data.username)
        self.driver.find_element_by_xpath(Data.pwd).send_keys(Data.password)
        self.driver.find_element_by_xpath(Data.loginbtn).click()

    def navigate_to_student_report(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SAR).click()
        time.sleep(3)

    def select_month_year(self,y,m):
        time.sleep(2)
        year = Select(self.driver.find_element_by_name(Data.select_year))
        time.sleep(3)
        month = Select(self.driver.find_element_by_name(Data.select_month))
        time.sleep(2)
        year.select_by_visible_text(y)
        time.sleep(2)
        month.select_by_visible_text(m)
        time.sleep(2)

    def navigate_to_semester_report(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.SR).click()

    def navigate_to_crc_report(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.crc).click()

    def Details_text(self):
        time.sleep(5)
        Details = self.driver.find_elements_by_xpath(Data.details)
        time.sleep(5)
        for i in range(len(Details)):
           print(Details[i].text)

    def Click_HomeButton(self):
        time.sleep(10)
        self.driver.find_element_by_xpath(Data.Home_icon).click()
        time.sleep(5)

    def CRC_footers(self):
        time.sleep(3)
        footer = self.driver.find_elements_by_xpath(Data.footer)
        for i in range(len(footer)):
            print(footer[i].text)
            time.sleep(5)

    def test_Distnames(self):
        time.sleep(3)
        dnames = self.driver.find_elements_by_xpath(Data.Dnames)
        for i in range(len(dnames)):
            print(dnames[i].text)
            time.sleep(2)

    def dots_dist(self):
        time.sleep(3)
        distnames = self.driver.find_elements_by_xpath(Data.Dnames)
        for i in range(len(distnames)):
            print(distnames[i].click())
            time.sleep(3)
            lists = self.driver.find_elements_by_class_name(Data.dots)
            time.sleep(2)
            count = len(lists) - 1
            print(distnames[i].text, ":", count)

    def X_Yaxis(self):
        time.sleep(3)
        x_axis = self.driver.find_elements_by_xpath(Data.xaxis)
        time.sleep(2)
        print("X axis menu list...")
        for i in range(len(x_axis)):
            print(x_axis[i].text)
        print("Y axis menu list...")
        time.sleep(2)
        y_axis = self.driver.find_elements_by_xpath(Data.yaxis)
        for i in range(len(y_axis)):
            print(y_axis[i].text)

    def crcDist_click(self):
        time.sleep(3)
        clu = self.driver.find_elements_by_xpath(Data.clusterlist)
        for i in range(len(clu)):
            clu[i].click()
            time.sleep(6)

    def clusters_text(self):
        time.sleep(3)
        cluster = self.driver.find_elements_by_xpath(Data.clusterlist)
        for i in range(len(cluster)):
            cluster[i].click()
            print(cluster[i].text)
            time.sleep(5)

    def X_axis(self):
        time.sleep(3)
        xvalues = self.driver.find_elements_by_xpath(Data.xaxis)
        for i in range(len(xvalues)):
            xvalues[i].click()
            time.sleep(3)

    def get_driver_path(self):
        os.chdir('../Sanity_test/')
        executable_path = os.path.join(os.getcwd(), 'Driver/chromedriver1')
        return executable_path

    def crc_validation(self):
        time.sleep(3)
        self.driver.find_element_by_xpath("//*[@id='select']/select/option[2]").click()
        print(self.driver.find_element_by_xpath("//*[@id='select']/select/option[2]").text)
        time.sleep(5)
        self.driver.find_element_by_xpath("//*[@id='select']/select/option[3]").click()
        time.sleep(5)

        self.driver.find_element_by_xpath("//*[@id='select']/select/option[4]").click()
        time.sleep(5)

        self.driver.find_element_by_xpath("//*[@id='select']/select/option[5]").click()
        time.sleep(5)

    #SAR_2
    def blocks_names(self):
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.Blocks).click()
        time.sleep(15)
        print("Block details..")
        infob = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infob)):
            print(infob[i].text)

    def clusters_names(self):
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.Clusters).click()
        time.sleep(15)
        print("Cluster details..")
        infoc = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infoc)):
            print(infoc[i].text)

    def schools_test(self):
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.Schools).click()
        print("for schools details...")
        time.sleep(15)
        infos = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infos)):
            print(infos[i].text)

    def Total_details(self):
        time.sleep(3)
        details = self.driver.find_elements_by_xpath(Data.SAR_Details)
        for i in range(len(details)):
            print(details[i].text)
            time.sleep(3)

    def test_mouse_over(self):
        time.sleep(3)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        def mouseover(i):
            action = ActionChains(self.driver)
            action.move_to_element(lists[i]).perform()
            time.sleep(3)
            del action

        i = 0
        while i < len(lists):
            mouseover(i)
            i = i + 1

    def Table_data(self):
        time.sleep(3)
        tabledata = self.driver.find_elements_by_xpath(Data.distrows)
        for i in range(len(tabledata)):
            print(tabledata[i].text)
        footer = self.driver.find_elements_by_xpath(Data.footer)
        for i in range(len(footer)):
            print(footer[i].text)
            time.sleep(5)


    def x_yaxis(self):
        time.sleep(3)
        xaxis_lists = self.driver.find_elements_by_xpath(Data.xaxis)
        yaxis_lists = self.driver.find_elements_by_xpath(Data.yaxis)
        for i in range(len(xaxis_lists)):
            xaxis_lists[i].click()
            print(xaxis_lists[i].text)
            time.sleep(4)
            for j in range(len(yaxis_lists)):
                yaxis_lists[i].click()
                print(yaxis_lists[j].text)
                time.sleep(4)

    def CRC_dist_Clicks(self):
        time.sleep(3)
        dist = self.driver.find_elements_by_xpath(Data.CRC_Districts)
        for i in range(len(dist)):
            dist[i].click()
            time.sleep(3)
            driver = cqube(self.driver)
            driver.CRC_footers()