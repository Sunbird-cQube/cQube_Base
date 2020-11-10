
import configparser
import json
import os
import time
import boto
import boto.s3
import psycopg2
import requests
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd


class GetData():
    def __init__(self):
        self.p = pwd()


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

    def get_admin_username(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_username']

    def get_admin_password(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_password']

    def get_driver(self):
        options = webdriver.ChromeOptions()
        prefs = {'download.default_directory': self.p.get_download_dir()}
        options.add_experimental_option('prefs', prefs)
        options.add_argument('--headless')
        self.driver=webdriver.Chrome(options=options,executable_path=self.p.get_driver_path())
        return self.driver

    def get_firefox_driver(self):
        p = pwd()
        options = webdriver.FirefoxOptions()
        prefs = {'download.default_directory': self.p.get_download_dir()}
        options.add_argument(prefs)
        options.add_argument("--headless")
        self.driver = webdriver.Firefox(options=options,executable_path=p.get_firefox_driver_path())
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
        self.driver.find_element_by_tag_name('button').click()
        self.page_loading(self.driver)

    def login_to_adminconsole(self,driver):
        self.driver = driver
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_id(Data.email).send_keys(self.get_admin_username())
        self.driver.find_element_by_id(Data.passwd).send_keys(self.get_admin_password())
        self.driver.find_element_by_id(Data.login).click()
        self.page_loading(self.driver)
        self.driver.find_element_by_tag_name('a').click()
        self.page_loading(self.driver)

    def navigate_to_telemetry(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        # self.driver.find_element_by_xpath(Data.telmetry_report).click()
        # time.sleep(2)
        self.driver.find_element_by_id("telemReport").click()
        self.page_loading(self.driver)

    def navigate_to_periodic_report(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.semester_sel).click()
        time.sleep(2)
        self.driver.find_element_by_id("patReport").click()
        time.sleep(4)

    def navigate_to_heatchart_report(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.semester_sel).click()
        time.sleep(2)
        self.driver.find_element_by_id("heatChart").click()
        time.sleep(4)

    def navigate_to_lo_table_report(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.semester_sel).click()
        time.sleep(2)
        self.driver.find_element_by_id("lotable").click()
        time.sleep(4)




    def navigate_to_composite_report(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_id('compositRep').click()
        time.sleep(8)

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
        self.driver.find_element_by_xpath(Data.attendance).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.SAR).click()
        time.sleep(6)

    def navigate_to_school_infrastructure(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(3)
        self.driver.find_element_by_id(Data.Report).click()
        time.sleep(5)

    def navigate_to_school_infrastructure_map(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.Reportmap).click()
        time.sleep(5)

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
        self.driver.find_element_by_xpath(Data.semester_sel).click()
        time.sleep(2)
        self.driver.find_element_by_id("semReport").click()
        time.sleep(5)


    def navigate_to_udise_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.udise_report).click()
        time.sleep(5)


    def navigate_to_crc_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.CRC).click()
        time.sleep(4)

    def navigate_to_diksha_graph(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.diksha).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.diksha_graph).click()
        time.sleep(6)

    def navigate_to_diksha_content_course(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.diksha).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.diksha_table).click()
        time.sleep(6)

    def navigate_to_tpd_content_progress(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.diksha).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.tpd_progress).click()
        time.sleep(6)

    def navigate_to_tpd_percentage_progress(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.diksha).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.tpd_percentage).click()
        time.sleep(6)

    def navigate_to_diksha_content_textbook(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.ener_textbook).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.content_textbook).click()
        time.sleep(6)

    def navigate_to_column_course(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.diksha).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.col_course).click()
        time.sleep(6)

    def navigate_to_column_textbook(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.ener_textbook).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.col_text).click()
        time.sleep(6)

    def navigate_to_completion_error(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.exception_click).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.completion).click()
        time.sleep(6)


    def navigate_to_semester_exception(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.exception_click).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.sem_exception).click()
        time.sleep(5)

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

    def get_driver_path(self):
        os.chdir('../cQube_Components/')
        executable_path = os.path.join(os.getcwd(), 'Driver/chromedriver1')
        return executable_path

    def crc_downloadwise(self):
        self.driver.find_element_by_xpath(Data.crc_sel2).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.crc_sel3).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.crc_sel4).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.crc_sel5).click()
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

    def CRC_dist_Clicks(self):
        dist = self.driver.find_elements_by_xpath(Data.CRC_Districts)
        for i in range(len(dist)):
            dist[i].click()
            time.sleep(3)

    #Admin login separation
    def get_admin_domain_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_domain']


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


    def get_demoadmin_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['createadmin']

    def get_demoreport_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['createviewer']

    def get_demoemission_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['createemission']

    def get_demoadmin_password(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['adminpassword']

    def get_demoreport_password(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['viewerpassword']

    def get_demoemission_password(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['emissionpassword']

    def get_nifi_status(self):
        cal = GetData()
        nifi_domain = cal.get_domain_name()
        url = nifi_domain + "/nifi-api/process-groups/root/process-groups"
        response = requests.get(url)
        json_resp = json.loads(response.text)
        nifi_status = []
        for x in json_resp.values():
            for y in x:
                name = y['component']['name']
                runningCount = y['component']['runningCount']
                stoppedCount = y['component']['stoppedCount']
                disabledCount = y['component']['disabledCount']
                invalidCount = y['component']['invalidCount']
                component_dict = {"name": name, "runningCount": runningCount, "stoppedCount": stoppedCount,
                                  "disabledCount": disabledCount, "invalidCount": invalidCount}
                nifi_status.append((component_dict))
        return nifi_status

    def get_runningCount(self, processor_name):
        cal = GetData()
        nifi_componets = cal.get_nifi_status()
        for x in nifi_componets:
            if x.get('name') == processor_name:
                self.runningCount = x.get('runningCount')
        return self.runningCount

    def get_stoppedCount(self, processor_name):
        cal = GetData()
        nifi_componets = cal.get_nifi_status()
        for x in nifi_componets:
            if x.get('name') == processor_name:
                self.stoppedCount = x.get('stoppedCount')
        return self.stoppedCount

    def get_invalidCount(self, processor_name):
        cal = GetData()
        nifi_componets = cal.get_nifi_status()
        for x in nifi_componets:
            if x.get('name') == processor_name:
                self.invalidCount = x.get('invalidCount')
        return self.invalidCount

    def get_disabledCount(self, processor_name):
        cal = GetData()
        nifi_componets = cal.get_nifi_status()
        for x in nifi_componets:
            if x.get('name') == processor_name:
                self.disabledCount = x.get('disabledCount')
        return self.disabledCount

    def get_time_zone(self):
        cal = GetData()
        nifi_domain = cal.get_domain_name()
        url = nifi_domain + "/nifi-api/process-groups/root/process-groups"
        response = requests.get(url)
        json_resp = json.loads(response.text)
        for x in json_resp.values():
            for y in x:
                self.time = y['status']['statsLastRefreshed']
                break
        return self.time

    def get_basedir(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['basedirpath']

    def connect_to_postgres(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        con = psycopg2.connect(host=config['config']['host'], database=config['config']['database'],
                               user=config['config']['user'], password=config['config']['db_password'])
        return con

    def get_db_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['database']

    def get_s3_files(self, folder):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        conn = boto.s3.connect_to_region(config['config']['aws_default_region'])
        bucket = conn.get_bucket(config['config']['s3_bucket'])
        files = []
        for key in bucket.list(prefix=folder, delimiter='*.json'):
            files.append(key.name.split("/"))
        return files

    def get_bucket(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        conn = boto.s3.connect_to_region(config['config']['aws_default_region'])
        bucket = conn.get_bucket(config['config']['s3_bucket'])
        return bucket

    def get_stackbar_all_list(self):
        lst = ['diksha/stack_bar_reports/2401.json', 'diksha/stack_bar_reports/2402.json',
               'diksha/stack_bar_reports/2403.json', 'diksha/stack_bar_reports/2404.json',
               'diksha/stack_bar_reports/2405.json', 'diksha/stack_bar_reports/2406.json',
               'diksha/stack_bar_reports/2407.json', 'diksha/stack_bar_reports/2408.json',
               'diksha/stack_bar_reports/2409.json', 'diksha/stack_bar_reports/2410.json',
               'diksha/stack_bar_reports/2411.json', 'diksha/stack_bar_reports/2412.json',
               'diksha/stack_bar_reports/2413.json', 'diksha/stack_bar_reports/2414.json',
               'diksha/stack_bar_reports/2415.json', 'diksha/stack_bar_reports/2416.json',
               'diksha/stack_bar_reports/2418.json', 'diksha/stack_bar_reports/2419.json',
               'diksha/stack_bar_reports/2420.json', 'diksha/stack_bar_reports/2421.json',
               'diksha/stack_bar_reports/2422.json', 'diksha/stack_bar_reports/2423.json',
               'diksha/stack_bar_reports/2424.json', 'diksha/stack_bar_reports/2425.json',
               'diksha/stack_bar_reports/2426.json', 'diksha/stack_bar_reports/2427.json',
               'diksha/stack_bar_reports/2428.json', 'diksha/stack_bar_reports/2429.json',
               'diksha/stack_bar_reports/2430.json', 'diksha/stack_bar_reports/2431.json',
               'diksha/stack_bar_reports/2432.json', 'diksha/stack_bar_reports/2433.json',
               'diksha/stack_bar_reports/All.json',
               'diksha/stack_bar_reports/diksha_metadata.json']
        return lst

    def get_stackbar_last_30_days_list(self):
        lst = ['diksha/stack_bar_reports/last_30_days/2401.json', 'diksha/stack_bar_reports/last_30_days/2402.json',
               'diksha/stack_bar_reports/last_30_days/2403.json', 'diksha/stack_bar_reports/last_30_days/2404.json',
               'diksha/stack_bar_reports/last_30_days/2405.json', 'diksha/stack_bar_reports/last_30_days/2406.json',
               'diksha/stack_bar_reports/last_30_days/2407.json', 'diksha/stack_bar_reports/last_30_days/2408.json',
               'diksha/stack_bar_reports/last_30_days/2409.json', 'diksha/stack_bar_reports/last_30_days/2410.json',
               'diksha/stack_bar_reports/last_30_days/2411.json', 'diksha/stack_bar_reports/last_30_days/2412.json',
               'diksha/stack_bar_reports/last_30_days/2413.json', 'diksha/stack_bar_reports/last_30_days/2414.json',
               'diksha/stack_bar_reports/last_30_days/2415.json', 'diksha/stack_bar_reports/last_30_days/2416.json',
               'diksha/stack_bar_reports/last_30_days/2418.json', 'diksha/stack_bar_reports/last_30_days/2419.json',
               'diksha/stack_bar_reports/last_30_days/2420.json', 'diksha/stack_bar_reports/last_30_days/2421.json',
               'diksha/stack_bar_reports/last_30_days/2422.json', 'diksha/stack_bar_reports/last_30_days/2423.json',
               'diksha/stack_bar_reports/last_30_days/2424.json', 'diksha/stack_bar_reports/last_30_days/2425.json',
               'diksha/stack_bar_reports/last_30_days/2426.json', 'diksha/stack_bar_reports/last_30_days/2427.json',
               'diksha/stack_bar_reports/last_30_days/2428.json', 'diksha/stack_bar_reports/last_30_days/2429.json',
               'diksha/stack_bar_reports/last_30_days/2430.json', 'diksha/stack_bar_reports/last_30_days/2431.json',
               'diksha/stack_bar_reports/last_30_days/2432.json', 'diksha/stack_bar_reports/last_30_days/2433.json',
               'diksha/stack_bar_reports/last_30_days/All.json']
        return lst

    def get_stackbar_last_7_days_list(self):
        lst = ['diksha/stack_bar_reports/last_7_days/2401.json', 'diksha/stack_bar_reports/last_7_days/2402.json',
               'diksha/stack_bar_reports/last_7_days/2403.json', 'diksha/stack_bar_reports/last_7_days/2404.json',
               'diksha/stack_bar_reports/last_7_days/2405.json', 'diksha/stack_bar_reports/last_7_days/2406.json',
               'diksha/stack_bar_reports/last_7_days/2407.json', 'diksha/stack_bar_reports/last_7_days/2408.json',
               'diksha/stack_bar_reports/last_7_days/2409.json', 'diksha/stack_bar_reports/last_7_days/2410.json',
               'diksha/stack_bar_reports/last_7_days/2411.json', 'diksha/stack_bar_reports/last_7_days/2412.json',
               'diksha/stack_bar_reports/last_7_days/2413.json', 'diksha/stack_bar_reports/last_7_days/2414.json',
               'diksha/stack_bar_reports/last_7_days/2415.json', 'diksha/stack_bar_reports/last_7_days/2416.json',
               'diksha/stack_bar_reports/last_7_days/2418.json', 'diksha/stack_bar_reports/last_7_days/2419.json',
               'diksha/stack_bar_reports/last_7_days/2420.json', 'diksha/stack_bar_reports/last_7_days/2421.json',
               'diksha/stack_bar_reports/last_7_days/2422.json', 'diksha/stack_bar_reports/last_7_days/2423.json',
               'diksha/stack_bar_reports/last_7_days/2424.json', 'diksha/stack_bar_reports/last_7_days/2425.json',
               'diksha/stack_bar_reports/last_7_days/2426.json', 'diksha/stack_bar_reports/last_7_days/2427.json',
               'diksha/stack_bar_reports/last_7_days/2428.json', 'diksha/stack_bar_reports/last_7_days/2429.json',
               'diksha/stack_bar_reports/last_7_days/2430.json', 'diksha/stack_bar_reports/last_7_days/2431.json',
               'diksha/stack_bar_reports/last_7_days/2432.json', 'diksha/stack_bar_reports/last_7_days/2433.json',
               'diksha/stack_bar_reports/last_7_days/All.json']
        return lst

    def get_stackbar_last_day_list(self):
        lst = ['diksha/stack_bar_reports/last_day/2401.json', 'diksha/stack_bar_reports/last_day/2402.json',
               'diksha/stack_bar_reports/last_day/2403.json', 'diksha/stack_bar_reports/last_day/2404.json',
               'diksha/stack_bar_reports/last_day/2405.json', 'diksha/stack_bar_reports/last_day/2406.json',
               'diksha/stack_bar_reports/last_day/2407.json', 'diksha/stack_bar_reports/last_day/2408.json',
               'diksha/stack_bar_reports/last_day/2409.json', 'diksha/stack_bar_reports/last_day/2410.json',
               'diksha/stack_bar_reports/last_day/2411.json', 'diksha/stack_bar_reports/last_day/2412.json',
               'diksha/stack_bar_reports/last_day/2413.json', 'diksha/stack_bar_reports/last_day/2414.json',
               'diksha/stack_bar_reports/last_day/2415.json', 'diksha/stack_bar_reports/last_day/2416.json',
               'diksha/stack_bar_reports/last_day/2418.json', 'diksha/stack_bar_reports/last_day/2419.json',
               'diksha/stack_bar_reports/last_day/2420.json', 'diksha/stack_bar_reports/last_day/2421.json',
               'diksha/stack_bar_reports/last_day/2422.json', 'diksha/stack_bar_reports/last_day/2423.json',
               'diksha/stack_bar_reports/last_day/2424.json', 'diksha/stack_bar_reports/last_day/2425.json',
               'diksha/stack_bar_reports/last_day/2426.json', 'diksha/stack_bar_reports/last_day/2427.json',
               'diksha/stack_bar_reports/last_day/2428.json', 'diksha/stack_bar_reports/last_day/2429.json',
               'diksha/stack_bar_reports/last_day/2430.json', 'diksha/stack_bar_reports/last_day/2431.json',
               'diksha/stack_bar_reports/last_day/2432.json', 'diksha/stack_bar_reports/last_day/2433.json',
               'diksha/stack_bar_reports/last_day/All.json']
        return lst

    def get_table_report_all_files(self, all):
        lst = []
        for x in range(2401, 2434):
            if x != 2417:
                lst.append("diksha/table_reports/" + str(all) + "/{}.json".format(x))
        lst.append("diksha/table_reports/" + str(all) + "/All.json")
        return lst

    def get_table_report_files(self, all):
        lst = []
        for x in range(2401, 2434):
            if x != 2417:
                lst.append("diksha/table_reports/all/{}/{}.json".format(all, x))
        lst.append("diksha/table_reports/all/{}/All.json".format(all))
        return lst

    def get_pat_grades_files(self):
        self.pat_grades = ['Grade 3.json', 'Grade 4.json', 'Grade 5.json', 'Grade 6.json', 'Grade 7.json',
                           'Grade 8.json']
        return self.pat_grades


    def get_cmp_pat_files(self, timeseries, levels):
        lst = []
        for x in range(3, 9):
            lst.append("pat/{}/{}/Grade {}.json".format(timeseries, levels, x))
        return lst

    def get_cmp_pat_levels_files(self, timeseries):
        lst = []
        lst.append("pat/{}/pat_block.json".format(timeseries))
        lst.append("pat/{}/pat_cluster.json".format(timeseries))
        lst.append("pat/{}/pat_district.json".format(timeseries))
        lst.append("pat/{}/pat_metadata.json".format(timeseries))
        lst.append("pat/{}/pat_school.json".format(timeseries))
        return lst
