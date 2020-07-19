import configparser
import os
import time
import logging
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd


class GetData():
    def __init__(self):
        self.p = pwd()

    def get_smoke_log(self):
        logging.basicConfig(filename=self.p.get_smoke_testing_log_dir(), filemode='w', format='%(asctime)s  %(levelname)s  %(message)s',
                            datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
        logger = logging.getLogger()
        return logger

    def get_integration_log(self):
        logging.basicConfig(filename=self.p.get_smoke_testing_log_dir(), filemode='w',
                            format='%(asctime)s  %(levelname)s  %(message)s',
                            datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
        logger = logging.getLogger()
        return logger

    # def get_functional_log(self):
    #     logging.basicConfig(filename=self.p.get_functional_testing_log_dir(), filemode='w', format='%(asctime)s  %(levelname)s  %(message)s',
    #                         datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
    #     logger = logging.getLogger()
    #     return logger

    def get_sanity_log(self):
        logging.basicConfig(filename=self.p.get_sanity_testing_log_dir(), filemode='w', format='%(asctime)s  %(levelname)s  %(message)s',
                            datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
        logger = logging.getLogger()
        return logger

    #regression testing logs
    def get_regression_log(self,log):
        # logging.basicConfig(filename=self.p.get_regression_testing_log_dir(), filemode='w', format='%(asctime)s  %(levelname)s  %(message)s',
        #                     datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
        # logger = logging.getLogger()
        # return logger
        if log == "login":
            logging.basicConfig(filename=self.p.get_regression_testing_login_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "sar":
            logging.basicConfig(filename=self.p.get_regression_testing_student_attendance_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "crc":
            logging.basicConfig(filename=self.p.get_regression_testing_crc_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "sr":
            logging.basicConfig(filename=self.p.get_regression_testing_semester_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "schoolinframap":
            logging.basicConfig(filename=self.p.get_regression_testing_schoolinfra_map_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "schoolinfrareport":
            logging.basicConfig(filename=self.p.get_regression_testing_schoolinfra_report_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger

    def get_functional_log(self,log):
        # logging.basicConfig(filename=self.p.get_regression_testing_log_dir(), filemode='w', format='%(asctime)s  %(levelname)s  %(message)s',
        #                     datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
        # logger = logging.getLogger()
        # return logger
        if log == "login":
            logging.basicConfig(filename=self.p.get_functional_testing_login_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "sar":
            logging.basicConfig(filename=self.p.get_functional_testing_student_attendance_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "crc":
            logging.basicConfig(filename=self.p.get_functional_testing_crc_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "sr":
            logging.basicConfig(filename=self.p.get_functional_testing_semester_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "schoolinframap":
            logging.basicConfig(filename=self.p.get_functional_testing_schoolinfra_map_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger
        elif log == "schoolinfrareport":
            logging.basicConfig(filename=self.p.get_functional_testing_schoolinfra_report_log_dir(), filemode='w',
                                format='%(asctime)s  %(levelname)s  %(message)s',
                                datefmt='%d-%m-%Y %I:%M:%S %p', level=logging.INFO)
            logger = logging.getLogger()
            return logger

    def get_domain_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['domain']

    def get_username(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['username']

    def get_password(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['password']

    def get_driver(self):
        options = webdriver.ChromeOptions()
        prefs = {'download.default_directory': self.p.get_download_dir()}
        options.add_experimental_option('prefs', prefs)
        options.add_argument('--headless')
        self.driver=webdriver.Chrome(options=options,executable_path=self.p.get_driver_path())
        return self.driver

    def open_cqube_appln(self,driver):
        self.driver = driver
        self.driver.maximize_window()
        self.driver.get(self.get_domain_name())
        self.driver.implicitly_wait(60)

    def login_cqube(self,driver):
        self.driver = driver
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_id(Data.email).send_keys(self.get_username())
        self.driver.find_element_by_id(Data.passwd).send_keys(self.get_password())
        self.driver.find_element_by_id(Data.login).click()
        self.page_loading(self.driver)
        #self.driver.find_element_by_tag_name('button').click()
        #self.page_loading(self.driver)

    def page_loading(self,driver):
        try:
            driver.implicitly_wait(5)
            self.driver = driver
            for x in range(1, 10):
                elem = self.driver.find_element_by_id('loader').text
                if str(elem) == "Loading…":
                    time.sleep(1)
                if str(elem) != "Loading…":
                    time.sleep(1)
                    break
        except NoSuchElementException:
            pass

    def click_on_state(self, driver):
        self.driver = driver
        self.driver.find_element_by_css_selector(Data.sar_hyper_link).click()
        time.sleep(5)

    def get_data_status(self):
        errMsg = self.driver.find_element_by_css_selector('p#errMsg')
        return errMsg

    def navigate_passwordchange(self):
        self.driver.implicitly_wait(10)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.user_options).click()
        time.sleep(2)


    def navigate_to_student_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_id(Data.SAR).click()
        time.sleep(6)
        # self.driver.find_element_by_xpath("//*[@id='SAR']")
    def navigate_to_school_infrastructure(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(3)
        self.driver.find_element_by_id(Data.Report).click()

    def navigate_to_school_infrastructure_map(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.Reportmap).click()

    def select_month_year(self,y,m):
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        time.sleep(2)
        year.select_by_visible_text(y)
        time.sleep(2)
        month.select_by_visible_text(m)
        time.sleep(2)

    def navigate_to_semester_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        # self.driver.find_element_by_xpath("//a[@id='sr']/div/td[2]").click()
        self.driver.find_element_by_xpath("//*[@id='sr']").click()
        time.sleep(5)


    def navigate_to_crc_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_id(Data.CRC).click()

    def Details_text(self):
        Details = self.driver.find_elements_by_xpath(Data.details)
        time.sleep(5)
        for i in range(len(Details)):
           print(Details[i].text)

    def Click_HomeButton(self):
            self.driver.find_element_by_id(Data.homeicon).click()
            time.sleep(3)

    def CRC_footers(self):
        footer = self.driver.find_elements_by_xpath(Data.footer)
        for i in range(len(footer)):
            print(footer[i].text)
            time.sleep(5)

    def test_Distnames(self):
        dnames = self.driver.find_elements_by_xpath(Data.SAR_Dnames)
        for i in range(len(dnames)):
            print(dnames[i].text)
            time.sleep(2)

    def dots_dist(self):
        distnames = self.driver.find_elements_by_xpath(Data.SAR_Dnames)
        for i in range(len(distnames)):
            distnames[i].click()
            time.sleep(3)
            lists = self.driver.find_elements_by_class_name(Data.dots)
            time.sleep(2)
            count = len(lists) - 1
            print(distnames[i].text, ":", count)

    def X_Yaxis(self):
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

    def crcclusters_click(self):
        clu = self.driver.find_elements_by_xpath(Data.clusterlist)
        for i in range(len(clu)):
            clu[i].click()
            time.sleep(3)

    def clusters_text(self):
        cluster = self.driver.find_elements_by_xpath(Data.clusterlist)
        for i in range(len(cluster)):
            cluster[i].click()
            print(cluster[i].text)
            time.sleep(5)

    def X_axis(self):
        xvalues = self.driver.find_elements_by_xpath(Data.xaxis)
        for i in range(len(xvalues)):
            xvalues[i].click()
            time.sleep(3)

    def get_driver_path(self):
        os.chdir('../cQube_Components/')
        executable_path = os.path.join(os.getcwd(), 'Driver/chromedriver1')
        return executable_path

    def crc_downloadwise(self):
        self.driver.find_element_by_xpath("//*[@id='select']/select/option[2]").click()
        time.sleep(3)
        self.driver.find_element_by_xpath("//*[@id='select']/select/option[3]").click()
        time.sleep(3)
        self.driver.find_element_by_xpath("//*[@id='select']/select/option[4]").click()
        time.sleep(3)
        self.driver.find_element_by_xpath("//*[@id='select']/select/option[5]").click()
        time.sleep(3)
    def crc_table_value(self):
        rows = self.driver.find_elements_by_xpath(Data.distrows)
        for j in range(len(rows)):
            print(rows[j].text)
            time.sleep(2)
    #SAR_2
    def blocks_names(self):
        self.driver.find_element_by_xpath(Data.SAR_Bnames).click()
        time.sleep(15)
        print("Block details..")
        infob = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infob)):
            print(infob[i].text)

    def clusters_names(self):
        self.driver.find_element_by_xpath(Data.SAR_cnames).click()
        time.sleep(15)
        print("Cluster details..")
        infoc = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infoc)):
            print(infoc[i].text)

    def schools_test(self):
        self.driver.find_element_by_xpath(Data.SAR_Schools_btn).click()
        print("for schools details...")
        time.sleep(15)
        infos = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infos)):
            print(infos[i].text)

    def Total_details(self):
        details = self.driver.find_elements_by_xpath(Data.SAR_Details)
        for i in range(len(details)):
            print(details[i].text)
            time.sleep(3)

    def test_mouse_over(self):
        self.driver.implicitly_wait(20)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        count = len(lists)-1
        time.sleep(5)
        def mouseover(i):
            action = ActionChains(self.driver)
            action.move_to_element(lists[i]).perform()
            time.sleep(3)
            del action

        i = 0
        while i < len(lists):
            mouseover(i)
            i = i + 1
        return count
    def Table_data(self):
        tabledata = self.driver.find_elements_by_xpath(Data.distrows)
        for i in range(len(tabledata)):
            print(tabledata[i].text)
        footer = self.driver.find_elements_by_xpath(Data.footer)
        for i in range(len(footer)):
            print(footer[i].text)
            time.sleep(5)


    def x_yaxis(self):
        xaxis_lists = self.driver.find_elements_by_xpath(Data.xaxis)
        yaxis_lists = self.driver.find_elements_by_xpath(Data.yaxis)
        for i in range(len(xaxis_lists)):
            xaxis_lists[i].click()
            print(xaxis_lists[i].text)
            time.sleep(3)
            for j in range(len(yaxis_lists)):
                yaxis_lists[i].click()
                print(yaxis_lists[j].text)
                time.sleep(4)

    def CRC_dist_Clicks(self):
        dist = self.driver.find_elements_by_xpath(Data.CRC_Districts)
        for i in range(len(dist)):
            dist[i].click()
            time.sleep(3)
            # driver = cqube(self.driver)
            # driver.CRC_footers()

    #Admin login separation
    def get_admin_domain_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_domain']

    def get_admin_username(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_username']

    def get_admin_password(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_password']

    def get_vpn_cqube(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_cqube_domain']

    def open_admin_appln(self,driver):
        self.driver = driver
        self.driver.maximize_window()
        self.driver.get(self.get_admin_domain_name())
        self.driver.implicitly_wait(60)

    def login_admin(self,driver):
        self.driver = driver
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_id(Data.email).send_keys(self.get_admin_username())
        self.driver.find_element_by_id(Data.passwd).send_keys(self.get_admin_password())
        self.driver.find_element_by_id(Data.login).click()
        time.sleep(3)

    def open_vpn_cqube(self,driver):
        self.driver = driver
        self.driver.maximize_window()
        self.driver.get(self.get_vpn_cqube())
        self.driver.implicitly_wait(60)
