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
        self.driver = webdriver.Chrome(options=options, executable_path=self.p.get_driver_path())
        return self.driver

    def get_firefox_driver(self):
        p = pwd()
        options = webdriver.FirefoxOptions()
        prefs = {'download.default_directory': self.p.get_download_dir()}
        options.add_argument(prefs)
        options.add_argument("--headless")
        self.driver = webdriver.Firefox(options=options, executable_path=p.get_firefox_driver_path())
        return self.driver

    def open_cqube_appln(self, driver):
        self.driver = driver
        self.driver.maximize_window()
        self.driver.get(self.get_domain_name())
        self.driver.implicitly_wait(60)

    def login_cqube(self, driver):
        self.driver = driver
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_id(Data.email).send_keys(self.get_username())
        self.driver.find_element_by_id(Data.passwd).send_keys(self.get_password())
        self.driver.find_element_by_id(Data.login).click()
        self.page_loading(self.driver)
        self.driver.find_element_by_tag_name('button').click()
        self.page_loading(self.driver)

    def login_to_adminconsole(self, driver):
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

    def logs_page(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        time.sleep(3)

    def page_loading(self, driver):
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

    def select_month_year(self, y, m):
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
        self.driver.find_element_by_xpath(Data.tpds).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.diksha_table).click()
        time.sleep(6)

    def navigate_to_tpd_content_progress(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.tpds).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.tpd_progress).click()
        time.sleep(6)

    def navigate_to_tpd_enrollment_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.tpds).click()
        time.sleep(2)
        self.driver.find_element_by_id('tpd-enroll').click()
        time.sleep(3)

    def navigate_to_tpd_completion_percentage(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.tpds).click()
        time.sleep(2)
        self.driver.find_element_by_id('tpd-comp').click()
        time.sleep(6)

    def navigate_to_tpd_percentage_progress(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.tpds).click()
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
        self.driver.find_element_by_xpath(Data.tpds).click()
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

    # SAR_2
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
        count = len(lists) - 1
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

    # Admin login separation
    def get_admin_domain_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_config_ini_path())
        return config['config']['admin_domain']

    def open_admin_appln(self, driver):
        self.driver = driver
        self.driver.maximize_window()
        self.driver.get(self.get_admin_domain_name())
        self.driver.implicitly_wait(60)

    def login_admin(self, driver):
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

    def get_cmp_diksha_tpd_files(self, level):
        lst = []
        lst.append("diksha_tpd/{}/All.json".format(level))
        lst.append("diksha_tpd/{}/Last_30_Day.json".format(level))
        lst.append("diksha_tpd/{}/Last_7_Day.json".format(level))
        lst.append("diksha_tpd/{}/Last_Day.json".format(level))
        return lst

    pat_district_id = [2401, 2402, 2403, 2404, 2405, 2406, 2407, 2408, 2409, 2410, 2411, 2412, 2413, 2414, 2415, 2416, 2417,
                 2418, 2419, 2420, 2421, 2422, 2423, 2424, 2425, 2426, 2427, 2428, 2429, 2430, 2431, 2432, 2433]
    pat_block_id = [240101, 240102, 240103, 240104, 240105, 240106, 240107, 240108, 240109, 240110, 240201, 240202,
                  240203, 240204, 240205, 240206, 240207, 240208, 240209, 240210, 240211, 240212, 240213, 240214,
                  240301, 240302, 240303, 240304, 240305, 240308, 240309, 240311, 240312, 240401, 240402, 240403,
                  240404, 240405, 240406, 240407, 240408, 240409, 240411, 240501, 240502, 240503, 240504, 240507,
                  240508, 240509, 240514, 240601, 240602, 240603, 240604, 240701, 240702, 240703, 240704, 240705,
                  240706, 240707, 240710, 240711, 240712, 240713, 240802, 240803, 240804, 240805, 240806, 240807,
                  240808, 240809, 240810, 240811, 240901, 240902, 240903, 240904, 240905, 240906, 240907, 240910,
                  240911, 240913, 240915, 240916, 241002, 241004, 241007, 241008, 241009, 241010, 241101, 241102,
                  241103, 241201, 241202, 241206, 241207, 241208, 241209, 241210, 241211, 241212, 241216, 241301,
                  241302, 241303, 241304, 241305, 241306, 241307, 241308, 241309, 241310, 241311, 241402, 241404,
                  241405, 241406, 241407, 241408, 241409, 241410, 241411, 241413, 241501, 241502, 241503, 241504,
                  241505, 241506, 241507, 241508, 241602, 241603, 241604, 241605, 241606, 241607, 241608, 241609,
                  241611, 241612, 241701, 241702, 241703, 241704, 241706, 241709, 241711, 241801, 241802, 241803,
                  241804, 241805, 241806, 241807, 241808, 241809, 241902, 241904, 241907, 241909, 241910, 241911,
                  241912, 241913, 241914, 242001, 242002, 242003, 242004, 242005, 242101, 242102, 242103, 242104,
                  242105, 242106, 242107, 242108, 242109, 242201, 242202, 242203, 242204, 242205, 242206, 242208,
                  242209, 242212, 242215, 242301, 242302, 242303, 242401, 242402, 242403, 242404, 242405, 242406,
                  242501, 242502, 242503, 242504, 242505, 242506, 242607, 242610, 242611, 242613, 242614, 242615,
                  242616, 242701, 242702, 242703, 242704, 242705, 242706, 242801, 242802, 242803, 242804, 242901,
                  242902, 242903, 242904, 243001, 243002, 243003, 243004, 243005, 243006, 243101, 243102, 243103,
                  243104, 243105, 243106, 243201, 243202, 243203, 243204, 243205, 243206, 243301, 243302, 243303,
                  243304, 243305]
    pat_cluster_id = [2415080001, 2401010001, 2401010002, 2401010003, 2401010004, 2401010005, 2401010006, 2401010007,
                  2401010008, 2401010009, 2401010010, 2401010011, 2401020001, 2401020002, 2401020003, 2401020004,
                  2401020005, 2401020006, 2401020007, 2401020008, 2401020009, 2401020010, 2401020011, 2401020012,
                  2401020013, 2401020014, 2401020015, 2401020016, 2401020017, 2401020018, 2401020019, 2401020020,
                  2401020021, 2401020022, 2401020023, 2401020024, 2401020025, 2401020026, 2401020027, 2401020028,
                  2401020029, 2401030001, 2401030002, 2401030003, 2401030004, 2401030005, 2401030006, 2401030007,
                  2401030008, 2401030009, 2401030010, 2401030011, 2401030012, 2401030013, 2401030014, 2401030015,
                  2401030016, 2401030017, 2401030018, 2401040001, 2401040002, 2401040003, 2401040004, 2401040005,
                  2401040006, 2401040007, 2401040008, 2401040009, 2401040010, 2401040011, 2401040012, 2401040013,
                  2401040014, 2401040015, 2401040016, 2401050001, 2433040001, 2401050002, 2401050003, 2401050004,
                  2401050005, 2401050006, 2401050007, 2401050008, 2401050009, 2401050010, 2401050011, 2401050012,
                  2401050013, 2401050014, 2401050015, 2401050016, 2401050017, 2401050018, 2401050019, 2401050020,
                  2401050021, 2401050022, 2401050023, 2401050024, 2401050025, 2401050026, 2401050027, 2401050028,
                  2401050029, 2401050030, 2401050031, 2401050032, 2401050033, 2401050034, 2401060001, 2401060002,
                  2401060003, 2401060004, 2401060005, 2401060006, 2401060007, 2401060008, 2401060009, 2401060010,
                  2401060011, 2401060012, 2401060013, 2401060014, 2401060015, 2401060016, 2401070001, 2401070002,
                  2401070003, 2401070004, 2401070005, 2401070006, 2401070007, 2401070008, 2401070009, 2401070010,
                  2401070011, 2401070012, 2401070013, 2401070014, 2401070015, 2401070016, 2401070017, 2401070018,
                  2401070019, 2401080001, 2401080002, 2401080003, 2401080004, 2401080005, 2401080006, 2401080007,
                  2401080008, 2401080009, 2401080010, 2401080011, 2401080012, 2401080013, 2401080014, 2401080015,
                  2401080016, 2401080017, 2401080018, 2401090001, 2401090002, 2401090003, 2401090004, 2401090005,
                  2401090006, 2401090007, 2401090008, 2401090009, 2401090010, 2401090011, 2401100001, 2401100002,
                  2401100003, 2401100004, 2401100005, 2401100006, 2401100007, 2401100008, 2402010001, 2402010002,
                  2402010003, 2402010004, 2402010005, 2402010006, 2402010007, 2402010008, 2402010009, 2402010010,
                  2402020001, 2402020002, 2402020003, 2402020004, 2402020005, 2402020006, 2402020007, 2402020008,
                  2402020009, 2402020010, 2402030001, 2402030002, 2402030003, 2402030004, 2402030005, 2402030006,
                  2402030007, 2402030008, 2402030009, 2402030010, 2402030011, 2402030012, 2402030013, 2402030014,
                  2402030015, 2402030016, 2402030017, 2402030018, 2402030019, 2402030020, 2402030021, 2402030022,
                  2402040001, 2402040002, 2402040003, 2402040004, 2402040005, 2402040006, 2402040007, 2402040008,
                  2402040009, 2402040010, 2402050001, 2402050002, 2402050003, 2402050004, 2402050005, 2402050006,
                  2402050007, 2402050008, 2402050009, 2402050010, 2402050011, 2402050012, 2402050013, 2402050014,
                  2402050015, 2402050016, 2402050017, 2402050018, 2402050019, 2402050020, 2402050021, 2402050022,
                  2402050023, 2402050024, 2402050025, 2402050026, 2402050027, 2402050028, 2402050029, 2402050030,
                  2402050031, 2402050032, 2402060001, 2402060002, 2402060003, 2402060004, 2402060005, 2402060006,
                  2402060007, 2402060008, 2402060009, 2402060010, 2402060011, 2402060012, 2402060013, 2402060014,
                  2402070001, 2402070002, 2402070003, 2402070004, 2402070005, 2402070006, 2402070007, 2402070008,
                  2402070009, 2402070010, 2402070011, 2402070012, 2402070013, 2402080001, 2402080002, 2402080003,
                  2402080004, 2402080005, 2402080006, 2402080007, 2402080008, 2402080009, 2402080010, 2402080011,
                  2402080012, 2402080013, 2402080014, 2402080015, 2402080016, 2402080017, 2402080018, 2402080019,
                  2402080020, 2402080021, 2402090001, 2402090002, 2402090003, 2402090004, 2402090005, 2402090006,
                  2402090007, 2402090008, 2402090009, 2402090010, 2402090011, 2402090012, 2402090013, 2402090014,
                  2402090015, 2402090016, 2402090017, 2402090018, 2402090019, 2402090020, 2402100001, 2402100002,
                  2402100003, 2402100004, 2402100005, 2402100006, 2402100007, 2402100008, 2402100009, 2402100010,
                  2402100011, 2402100012, 2402100013, 2402100014, 2402100015, 2402100016, 2402100017, 2402100018,
                  2402100019, 2402100020, 2402100021, 2402100022, 2402100023, 2402100024, 2402100025, 2402100026,
                  2402110001, 2402110002, 2402110003, 2402110004, 2402110005, 2402110006, 2402110007, 2402110008,
                  2402110009, 2402110010, 2402110011, 2402110012, 2402110013, 2402120001, 2402120002, 2402120003,
                  2402120004, 2402120005, 2402120006, 2402120007, 2402120008, 2402120009, 2402120010, 2402120011,
                  2402120012, 2402120013, 2402120014, 2402120015, 2402130001, 2402130002, 2402130003, 2402130004,
                  2402130005, 2402130006, 2402130007, 2402130008, 2402130009, 2402130010, 2402130011, 2402130012,
                  2402130013, 2402130014, 2402130015, 2402140001, 2402140002, 2402140003, 2402140004, 2402140005,
                  2402140006, 2402140007, 2403010001, 2403010002, 2403010003, 2403010004, 2403010005, 2403010006,
                  2403010007, 2403010008, 2403020001, 2403020002, 2403020003, 2403020004, 2403020005, 2403020006,
                  2403030001, 2403030002, 2403030003, 2403030004, 2403030005, 2403030006, 2403030007, 2403030008,
                  2403030009, 2403030010, 2403030011, 2403040001, 2403040002, 2403040003, 2403040004, 2403040005,
                  2403040006, 2403040007, 2403050001, 2403050002, 2403050003, 2403050004, 2403050005, 2403050006,
                  2403050007, 2403080001, 2403080002, 2403080003, 2403080004, 2403080005, 2403080006, 2403080007,
                  2403080008, 2403080009, 2403090001, 2403090002, 2403090003, 2403090004, 2403090005, 2403090006,
                  2403090007, 2403090008, 2403110001, 2403110002, 2403110003, 2403110004, 2403120001, 2403120002,
                  2403120003, 2403120004, 2403120005, 2403120006, 2403120007, 2403120008, 2403120009, 2403120010,
                  2403120011, 2403120012, 2404010001, 2404010002, 2404010003, 2404010004, 2404010005, 2404010006,
                  2404010007, 2404020001, 2404020002, 2404020003, 2404020004, 2404020005, 2404020006, 2404020007,
                  2404020008, 2404020009, 2404020010, 2404020011, 2404020012, 2404020013, 2404020014, 2404030001,
                  2404030002, 2404030003, 2404030004, 2404030005, 2404030006, 2404030007, 2404030008, 2404030009,
                  2404040001, 2404040002, 2404040003, 2404040004, 2404040005, 2404040006, 2404040007, 2404040008,
                  2404040009, 2404040010, 2404040011, 2404040012, 2404040013, 2404040014, 2404040015, 2404040016,
                  2404040017, 2404050001, 2404050002, 2404050003, 2404050004, 2404050005, 2404050006, 2404050007,
                  2404060001, 2404060002, 2404060003, 2404060004, 2404060005, 2404060006, 2404060007, 2404060008,
                  2404070001, 2404070002, 2404070003, 2404070004, 2404070005, 2404070006, 2404070007, 2404070008,
                  2404070009, 2404080001, 2404080002, 2404080003, 2404080004, 2404080005, 2404080006, 2404080007,
                  2404080008, 2404080009, 2404080010, 2404080011, 2404080012, 2404080013, 2404080014, 2404080015,
                  2404090001, 2404090002, 2404090003, 2404090004, 2404090005, 2404090006, 2404090007, 2404090008,
                  2404090009, 2404090010, 2404090011, 2404110001, 2404110002, 2404110003, 2404110004, 2404110005,
                  2405010001, 2405010002, 2405010003, 2405010004, 2405010005, 2405010006, 2405010007, 2405010008,
                  2405010009, 2405010010, 2405010011, 2405010012, 2405010013, 2405010014, 2405010015, 2405010016,
                  2405010017, 2405020001, 2405020002, 2405020003, 2405020004, 2405020005, 2405020006, 2405020007,
                  2405020008, 2405020009, 2405020010, 2405020011, 2405020012, 2405020013, 2405020014, 2405030001,
                  2405030002, 2405030003, 2405030004, 2405030005, 2405030006, 2405030007, 2405030008, 2405030009,
                  2405040001, 2405040002, 2405040003, 2405040004, 2405040005, 2405040006, 2405040007, 2405040008,
                  2405040009, 2405040010, 2405040011, 2405040012, 2405040013, 2405040014, 2405040015, 2405040016,
                  2405040017, 2405040018, 2405040019, 2405040020, 2405040021, 2405040022, 2405070001, 2405070002,
                  2405070003, 2405070004, 2405070005, 2405070006, 2405070007, 2405070008, 2405070009, 2405070010,
                  2405070011, 2405070012, 2405070013, 2405070014, 2405070015, 2405070016, 2405070017, 2405070018,
                  2405070019, 2405070020, 2405070021, 2405070022, 2405070023, 2405080001, 2405080002, 2405080003,
                  2405080004, 2405080005, 2405080006, 2405080007, 2405080008, 2405080009, 2405080010, 2405080011,
                  2405080012, 2405090001, 2405090002, 2405090003, 2405090004, 2405090005, 2405090006, 2405090007,
                  2405090008, 2405090009, 2405090010, 2405090011, 2405090012, 2405090013, 2405090014, 2405090015,
                  2405090016, 2405140001, 2405140002, 2405140003, 2405140004, 2405140005, 2405140006, 2405140007,
                  2405140008, 2405140009, 2405140010, 2405140011, 2406010001, 2406010002, 2406010003, 2406010004,
                  2406010005, 2406010006, 2406010007, 2406010008, 2406010009, 2406010010, 2406010011, 2406010012,
                  2406010013, 2406010014, 2406010015, 2406010016, 2406010017, 2406010018, 2406010019, 2406020001,
                  2406020002, 2406020003, 2406020004, 2406020005, 2406020006, 2406020007, 2406020008, 2406020009,
                  2406020010, 2406020011, 2406020012, 2406020013, 2406020014, 2406020015, 2406020016, 2406020017,
                  2406020018, 2406020019, 2406020020, 2406020021, 2406020022, 2406020023, 2406030001, 2406030002,
                  2406030003, 2406030004, 2406030005, 2406030006, 2406030007, 2406030008, 2406030009, 2406030010,
                  2406030011, 2406030012, 2406030013, 2406040001, 2406040002, 2406040003, 2406040004, 2406040005,
                  2406040006, 2406040007, 2406040008, 2406040009, 2406040010, 2406040011, 2407010001, 2407010002,
                  2407010003, 2407010004, 2407010005, 2407020001, 2407020002, 2407020003, 2407020004, 2407020005,
                  2407020006, 2407020007, 2407030001, 2407030002, 2407030003, 2407030004, 2407030005, 2407030006,
                  2407030007, 2407030008, 2407030009, 2407030010, 2407040001, 2407040002, 2407040003, 2407040004,
                  2407040005, 2407040006, 2407040007, 2407040008, 2407040009, 2407040010, 2407040011, 2407050001,
                  2407050002, 2407050003, 2407050004, 2407050005, 2407050006, 2407050007, 2407050008, 2407050009,
                  2407050010, 2407050011, 2407050012, 2407050013, 2407050014, 2407050015, 2407050016, 2407050017,
                  2407050018, 2407060001, 2407060002, 2407060003, 2407060004, 2407060005, 2407060006, 2407060007,
                  2407060008, 2407060009, 2407060010, 2407060011, 2407060012, 2407060013, 2407060014, 2407060015,
                  2407060016, 2407060017, 2407060018, 2407060019, 2407060020, 2407060021, 2407060022, 2407060023,
                  2407060024, 2407060025, 2407070001, 2407070002, 2407070003, 2407070004, 2407070005, 2407070006,
                  2407070007, 2407070008, 2407070009, 2407070010, 2407070011, 2407070012, 2407070013, 2407070014,
                  2407100001, 2407100002, 2407100003, 2407100004, 2407100005, 2407100006, 2407100007, 2407100008,
                  2407110001, 2407110002, 2407110003, 2407110004, 2407110005, 2407110006, 2407120001, 2407120002,
                  2407120003, 2407120004, 2407120005, 2407120006, 2407120007, 2407120008, 2407120009, 2407120010,
                  2407120011, 2407120012, 2407120013, 2407120014, 2407120015, 2407120016, 2407120017, 2407120018,
                  2407120019, 2407120020, 2407120021, 2407120022, 2407120023, 2407120024, 2407120025, 2407120026,
                  2407120027, 2407120028, 2407120029, 2407120030, 2407120031, 2407120032, 2407120033, 2407120034,
                  2407120035, 2407120036, 2407120037, 2407120038, 2407120039, 2407120040, 2407120041, 2407120042,
                  2407120043, 2407120044, 2407120045, 2407120046, 2407120047, 2407120048, 2407120049, 2407120050,
                  2407120051, 2407120052, 2407120053, 2407120054, 2407120055, 2407120056, 2407120057, 2407120058,
                  2407120059, 2407120060, 2407120061, 2407120062, 2407120063, 2407120064, 2407120065, 2407120066,
                  2407120067, 2407130001, 2407130002, 2407130003, 2407130004, 2407130005, 2408020001, 2408020002,
                  2408020003, 2408020004, 2408020005, 2408020006, 2408020007, 2408020008, 2408020009, 2408020010,
                  2408020011, 2408030001, 2408030002, 2408030003, 2408030004, 2408030005, 2408030006, 2408030007,
                  2408030008, 2408030009, 2408030010, 2408040001, 2408040002, 2408040003, 2408040004, 2408050001,
                  2408050002, 2408050003, 2408050004, 2408050005, 2408050006, 2408050007, 2408050008, 2408050009,
                  2408050010, 2408050011, 2408050012, 2408050013, 2408050014, 2408050015, 2408060001, 2408060002,
                  2408060003, 2408060004, 2408060005, 2408060006, 2408060007, 2408060008, 2408070001, 2408070002,
                  2408070003, 2408070004, 2408070005, 2408070006, 2408070007, 2408070008, 2408070009, 2408070010,
                  2408070011, 2408080001, 2408080002, 2408080003, 2408080004, 2408080005, 2408080006, 2408080007,
                  2408080008, 2408080009, 2408080010, 2408090001, 2408090002, 2408090003, 2408090004, 2408090005,
                  2408100001, 2408100002, 2408100003, 2408100004, 2408100005, 2408100006, 2408100007, 2408100008,
                  2408100009, 2408110001, 2408110002, 2408110003, 2408110004, 2408110005, 2409010001, 2409010002,
                  2409010003, 2409010004, 2409010005, 2409010006, 2409010007, 2409020001, 2409020002, 2409020003,
                  2409020004, 2409020005, 2409020006, 2409020007, 2409020008, 2409020009, 2409020010, 2409020011,
                  2409020012, 2409020013, 2409020014, 2409030001, 2409030002, 2409030003, 2409030004, 2409030005,
                  2409030006, 2409030007, 2409040001, 2409040002, 2409040003, 2409040004, 2409040005, 2409040006,
                  2409040007, 2409040008, 2409040009, 2409040010, 2409040011, 2409050001, 2409050002, 2409050003,
                  2409050004, 2409050005, 2409050006, 2409050007, 2409050008, 2409050009, 2409060001, 2409060002,
                  2409060003, 2409060004, 2409060005, 2409070001, 2409070002, 2409070003, 2409070004, 2409070005,
                  2409100001, 2409100002, 2409100003, 2409100004, 2409100005, 2409100006, 2409100007, 2409100008,
                  2409100009, 2409110001, 2409110002, 2409110003, 2409110004, 2409110005, 2409110006, 2409110007,
                  2409110008, 2409110009, 2409110010, 2409110011, 2409110012, 2409110013, 2409110014, 2409110015,
                  2409130001, 2409130002, 2409130003, 2409130004, 2409130005, 2409130006, 2409130007, 2409130008,
                  2409130009, 2409130010, 2409150001, 2409150002, 2409150003, 2409150004, 2409150005, 2409150006,
                  2409150007, 2409150008, 2409150009, 2409150010, 2409150011, 2409150012, 2409150013, 2409150014,
                  2409150015, 2409150016, 2409150017, 2409150018, 2409150019, 2409150020, 2409150021, 2409150022,
                  2409150023, 2409150024, 2409150025, 2409160001, 2409160002, 2409160003, 2409160004, 2409160005,
                  2409160006, 2409160007, 2409160008, 2409160009, 2410020001, 2410020002, 2410020003, 2410020004,
                  2410020005, 2410020006, 2410040001, 2410040002, 2410040003, 2410040004, 2410040005, 2410040006,
                  2410040007, 2410040008, 2410040009, 2410040010, 2410070001, 2410070002, 2410070003, 2410070004,
                  2410070005, 2410070006, 2410070007, 2410070008, 2410070009, 2410070010, 2410070011, 2410070012,
                  2410070013, 2410070014, 2410070015, 2410070016, 2410070017, 2410070018, 2410070019, 2410070020,
                  2410070021, 2410070022, 2410070023, 2410070024, 2410070025, 2410070026, 2410070027, 2410080001,
                  2410080002, 2410080003, 2410080004, 2410080005, 2410090001, 2410090002, 2410090003, 2410090004,
                  2410090005, 2410090006, 2410090007, 2410090008, 2410090009, 2410090010, 2410090011, 2410100001,
                  2410100002, 2410100003, 2410100004, 2410100005, 2410100006, 2410100007, 2410100008, 2410100009,
                  2410100010, 2410100011, 2410100012, 2411010001, 2411010002, 2411010003, 2411010004, 2411010005,
                  2411010006, 2411010007, 2411010008, 2411010009, 2411010010, 2411010011, 2411010012, 2411010013,
                  2411010014, 2411010015, 2411010016, 2411010017, 2411010018, 2411010019, 2411020001, 2411020002,
                  2411020003, 2411020004, 2411020005, 2411020006, 2411020007, 2411020008, 2411020009, 2411030001,
                  2411030002, 2411030003, 2411030004, 2411030005, 2411030006, 2411030007, 2412010001, 2412010002,
                  2412010003, 2412010004, 2412010005, 2412010006, 2412010007, 2412010008, 2412020001, 2412020002,
                  2412020003, 2412020004, 2412020005, 2412020006, 2412020007, 2412020008, 2412060001, 2412060002,
                  2412060003, 2412060004, 2412060005, 2412060006, 2412060007, 2412060008, 2412060009, 2412060010,
                  2412060011, 2412060012, 2412070001, 2412070002, 2412070003, 2412070004, 2412070005, 2412070006,
                  2412070007, 2412070008, 2412070009, 2412070010, 2412070011, 2412070012, 2412070013, 2412070014,
                  2412080001, 2412080002, 2412080003, 2412080004, 2412080005, 2412080006, 2412080007, 2412080008,
                  2412080009, 2412080010, 2412090001, 2412090002, 2412090003, 2412090004, 2412090005, 2412090006,
                  2412090007, 2412090008, 2412100001, 2412100002, 2412100003, 2412100004, 2412100005, 2412100006,
                  2412100007, 2412100008, 2412110001, 2412110002, 2412110003, 2412110004, 2412110005, 2412120001,
                  2412120002, 2412120003, 2412120004, 2412120005, 2412120006, 2412120007, 2412120008, 2412120009,
                  2412120010, 2412160001, 2412160002, 2412160003, 2412160004, 2412160005, 2412160006, 2412160007,
                  2413010001, 2413010002, 2413010003, 2413010004, 2413010005, 2413010006, 2413010007, 2413010008,
                  2413010009, 2413020001, 2413020002, 2413020003, 2413020004, 2413020005, 2413020006, 2413020007,
                  2413030001, 2413030002, 2413030003, 2413030004, 2413030005, 2413040001, 2413040002, 2413040003,
                  2413040004, 2413040005, 2413040006, 2413040007, 2413040008, 2413040009, 2413050001, 2413050002,
                  2413050003, 2413050004, 2413050005, 2413060001, 2413060002, 2413060003, 2413060004, 2413060005,
                  2413060006, 2413060007, 2413070001, 2413070002, 2413070003, 2413070004, 2413070005, 2413080001,
                  2413080002, 2413080003, 2413080004, 2413080005, 2413080006, 2413090001, 2413090002, 2413090003,
                  2413090004, 2413100001, 2413100002, 2413100003, 2413100004, 2413100005, 2413100006, 2413100007,
                  2413100008, 2413110001, 2413110002, 2413110003, 2413110004, 2413110005, 2413110006, 2413110007,
                  2413110008, 2413110009, 2413110010, 2413110011, 2414020001, 2414020002, 2414020003, 2414020004,
                  2414020005, 2414040001, 2414040002, 2414040003, 2414040004, 2414040005, 2414050001, 2414050002,
                  2414050003, 2414050004, 2414050005, 2414050006, 2414050007, 2414050008, 2414050009, 2414050010,
                  2414050011, 2414050012, 2414050013, 2414050014, 2414050015, 2414050016, 2414050017, 2414050018,
                  2414050019, 2414050020, 2414050021, 2414060001, 2414060002, 2414060003, 2414060004, 2414060005,
                  2414060006, 2414070001, 2414070002, 2414070003, 2414070004, 2414070005, 2414070006, 2414070007,
                  2414070008, 2414070009, 2414070010, 2414070011, 2414080001, 2414080002, 2414080003, 2414080004,
                  2414080005, 2414080006, 2414090001, 2414090002, 2414090003, 2414090004, 2414090005, 2414090006,
                  2414090007, 2414090008, 2414090009, 2414090010, 2414090011, 2414100001, 2414100002, 2414100003,
                  2414100004, 2414100005, 2414100006, 2414100007, 2414100008, 2414100009, 2414100010, 2414100011,
                  2414100012, 2414100013, 2414100014, 2414110001, 2414110002, 2414110003, 2414110004, 2414110005,
                  2414110006, 2414110007, 2414110008, 2414110009, 2414110010, 2414110011, 2414110012, 2414110013,
                  2414110014, 2414110015, 2414110016, 2414130001, 2414130002, 2414130003, 2414130004, 2414130005,
                  2415010001, 2415010002, 2415010003, 2415010004, 2415010005, 2415010006, 2415010007, 2415010008,
                  2415010009, 2415010010, 2415010011, 2415010012, 2415010013, 2415010014, 2415010015, 2415010016,
                  2415010017, 2415010018, 2415010019, 2415010020, 2415010021, 2415010022, 2415010023, 2415010024,
                  2415020001, 2415020002, 2415020003, 2415020004, 2415020005, 2415020006, 2415020007, 2415020008,
                  2415020009, 2415030001, 2415030002, 2415030003, 2415030004, 2415030005, 2415030006, 2415030007,
                  2415030008, 2415030009, 2415030010, 2415030011, 2415030012, 2415030013, 2415030014, 2415030015,
                  2415030016, 2415030017, 2415030018, 2415030019, 2415030020, 2415030021, 2415030022, 2415040001,
                  2415040002, 2415040003, 2415040004, 2415040005, 2415040006, 2415040007, 2415040008, 2415040009,
                  2415040010, 2415040011, 2415040012, 2415040013, 2415040014, 2415040015, 2415050001, 2415050002,
                  2415050003, 2415050004, 2415050005, 2415050006, 2415050007, 2415050008, 2415050009, 2415050010,
                  2415050011, 2415050012, 2415050013, 2415050014, 2415050015, 2415050016, 2415060001, 2415060002,
                  2415060003, 2415060004, 2415060005, 2415070001, 2415070002, 2415070003, 2415070004, 2415070005,
                  2415080002, 2415080003, 2415080004, 2415080005, 2415080006, 2415080007, 2415080008, 2415080009,
                  2415080010, 2415080011, 2416020001, 2416020002, 2416020003, 2416020004, 2416020005, 2416020006,
                  2416020007, 2416020008, 2416020009, 2416020010, 2416020011, 2416020012, 2416020013, 2416020014,
                  2416020015, 2416020016, 2416020017, 2416020018, 2416020019, 2416020020, 2416020021, 2416020022,
                  2416020023, 2416020024, 2416030001, 2416030002, 2416030003, 2416030004, 2416030005, 2416030006,
                  2416030007, 2416030008, 2416030009, 2416030010, 2416030011, 2416030012, 2416030013, 2416030014,
                  2416030015, 2416030016, 2416040001, 2416040002, 2416040003, 2416040004, 2416040005, 2416040006,
                  2416040007, 2416040008, 2416050001, 2416050002, 2416050003, 2416050004, 2416050005, 2416050006,
                  2416050007, 2416050008, 2416050009, 2416050010, 2416050011, 2416050012, 2416050013, 2416050014,
                  2416050015, 2416060001, 2416060002, 2416060003, 2416060004, 2416060005, 2416060006, 2416060007,
                  2416060008, 2416070001, 2416070002, 2416070003, 2416070004, 2416070005, 2416070006, 2416070007,
                  2416070008, 2416070009, 2416080001, 2416080002, 2416080003, 2416080004, 2416080005, 2416080006,
                  2416080007, 2416080008, 2416080009, 2416080010, 2416080011, 2416080012, 2416080013, 2416080014,
                  2416080015, 2416080016, 2416080017, 2416080018, 2416080019, 2416080020, 2416090001, 2416090002,
                  2416090003, 2416090004, 2416090005, 2416090006, 2416090007, 2416090008, 2416090009, 2416090010,
                  2416090011, 2416090012, 2416090013, 2416090014, 2416090015, 2416110001, 2416110002, 2416110003,
                  2416110004, 2416110005, 2416110006, 2416110007, 2416110008, 2416120001, 2416120002, 2416120003,
                  2416120004, 2416120005, 2417010001, 2417010002, 2417010003, 2417010004, 2417010005, 2417010006,
                  2417010007, 2417010008, 2417010009, 2417010010, 2417010011, 2417010012, 2417010013, 2417010014,
                  2417010015, 2417010016, 2417010017, 2417010018, 2417010019, 2417020001, 2417020002, 2417020003,
                  2417020004, 2417020005, 2417020006, 2417020007, 2417020008, 2417020009, 2417020010, 2417020011,
                  2417020012, 2417020013, 2417020014, 2417020015, 2417020016, 2417020017, 2417020018, 2417020019,
                  2417020020, 2417020021, 2417020022, 2417020023, 2417020024, 2417020025, 2417020026, 2417020027,
                  2417020028, 2417020029, 2417020030, 2417030001, 2417030002, 2417030003, 2417030004, 2417030005,
                  2417030006, 2417030007, 2417030008, 2417030009, 2417030010, 2417030011, 2417030012, 2417030013,
                  2417030014, 2417030015, 2417030016, 2417030017, 2417030018, 2417040001, 2417040002, 2417040003,
                  2417040004, 2417040005, 2417060001, 2417060002, 2417060003, 2417060004, 2417060005, 2417060006,
                  2417060007, 2417060008, 2417060009, 2417060010, 2417060011, 2417060012, 2417060013, 2417060014,
                  2417060015, 2417060016, 2417090001, 2417090002, 2417090003, 2417090004, 2417090005, 2417090006,
                  2417090007, 2417090008, 2417090009, 2417090010, 2417090011, 2417090012, 2417090013, 2417090014,
                  2417110001, 2417110002, 2417110003, 2417110004, 2417110005, 2417110006, 2417110007, 2417110008,
                  2417110009, 2417110010, 2417110011, 2417110012, 2417110013, 2417110014, 2417110015, 2417110016,
                  2417110017, 2417110018, 2417110019, 2417110020, 2417110021, 2417110022, 2418010001, 2418010002,
                  2418010003, 2418010004, 2418010005, 2418010006, 2418010007, 2418010008, 2418010009, 2418010010,
                  2418010011, 2418010012, 2418010013, 2418010014, 2418010015, 2418010016, 2418010017, 2418010018,
                  2418010019, 2418010020, 2418010021, 2418010022, 2418010023, 2418010024, 2418010025, 2418010026,
                  2418010027, 2418020001, 2418020002, 2418020003, 2418020004, 2418020005, 2418020006, 2418020007,
                  2418020008, 2418020009, 2418020010, 2418020011, 2418020012, 2418030001, 2418030002, 2418030003,
                  2418030004, 2418030005, 2418030006, 2418030007, 2418030008, 2418030009, 2418030010, 2418030011,
                  2418030012, 2418030013, 2418030014, 2418030015, 2418030016, 2418030017, 2418040001, 2418040002,
                  2418040003, 2418040004, 2418040005, 2418040006, 2418040007, 2418040008, 2418040009, 2418040010,
                  2418040011, 2418040012, 2418040013, 2418040014, 2418040015, 2418050001, 2418050002, 2418050003,
                  2418050004, 2418050005, 2418050006, 2418050007, 2418050008, 2418050009, 2418050010, 2418050011,
                  2418050012, 2418050013, 2418050014, 2418050015, 2418050016, 2418050017, 2418050018, 2418050019,
                  2418050020, 2418050021, 2418050022, 2418050023, 2418060001, 2418060002, 2418060003, 2418060004,
                  2418060005, 2418060006, 2418060007, 2418060008, 2418060009, 2418060010, 2418060011, 2418060012,
                  2418060013, 2418060014, 2418060015, 2418060016, 2418060017, 2418060018, 2418060019, 2418060020,
                  2418060021, 2418060022, 2418060023, 2418060024, 2418060025, 2418070001, 2418070002, 2418070003,
                  2418070004, 2418070005, 2418070006, 2418070007, 2418070008, 2418070009, 2418070010, 2418070011,
                  2418070012, 2418070013, 2418070014, 2418070015, 2418070016, 2418070017, 2418070018, 2418070019,
                  2418070020, 2418070021, 2418080001, 2418080002, 2418080003, 2418080004, 2418080005, 2418080006,
                  2418080007, 2418080008, 2418090001, 2418090002, 2418090003, 2418090004, 2418090005, 2418090006,
                  2418090007, 2418090008, 2418090009, 2418090010, 2418090011, 2419020001, 2419020002, 2419020003,
                  2419020004, 2419020005, 2419020006, 2419020007, 2419020008, 2419020009, 2419020010, 2419020011,
                  2419020012, 2419020013, 2419020014, 2419020015, 2419040001, 2419040002, 2419040003, 2419040004,
                  2419040005, 2419040006, 2419040007, 2419040008, 2419040009, 2419040010, 2419070001, 2419070002,
                  2419070003, 2419070004, 2419070005, 2419070006, 2419070007, 2419070008, 2419070009, 2419070010,
                  2419070011, 2419070012, 2419070013, 2419070014, 2419070015, 2419090001, 2419090002, 2419090003,
                  2419090004, 2419090005, 2419090006, 2419090007, 2419090008, 2419090009, 2419090010, 2419090011,
                  2419090012, 2419090013, 2419090014, 2419100001, 2419100002, 2419100003, 2419100004, 2419100005,
                  2419100006, 2419110001, 2419110002, 2419110003, 2419110004, 2419110005, 2419110006, 2419110007,
                  2419110008, 2419110009, 2419110010, 2419110011, 2419110012, 2419110013, 2419110014, 2419110015,
                  2419110016, 2419110017, 2419110018, 2419110019, 2419120001, 2419120002, 2419120003, 2419120004,
                  2419120005, 2419120006, 2419120007, 2419120008, 2419120009, 2419120010, 2419120011, 2419120012,
                  2419120013, 2419130001, 2419130002, 2419130003, 2419130004, 2419130005, 2419130006, 2419130007,
                  2419130008, 2419130009, 2419130010, 2419130011, 2419130012, 2419130013, 2419130014, 2419130015,
                  2419130016, 2419130017, 2419130018, 2419140001, 2419140002, 2419140003, 2419140004, 2419140005,
                  2419140006, 2419140007, 2419140008, 2420010001, 2420010002, 2420010003, 2420010004, 2420010005,
                  2420010006, 2420010007, 2420010008, 2420010009, 2420010010, 2420010011, 2420010012, 2420010013,
                  2420010014, 2420010015, 2420020001, 2420020002, 2420020003, 2420020004, 2420020005, 2420020006,
                  2420020007, 2420020008, 2420020009, 2420020010, 2420020011, 2420020012, 2420020013, 2420020014,
                  2420020015, 2420020016, 2420020017, 2420020018, 2420020019, 2420020020, 2420030001, 2420030002,
                  2420030003, 2420030004, 2420030005, 2420030006, 2420030007, 2420030008, 2420030009, 2420030010,
                  2420030011, 2420040001, 2420040002, 2420040003, 2420040004, 2420040005, 2420040006, 2420040007,
                  2420040008, 2420050001, 2420050002, 2420050003, 2420050004, 2420050005, 2420050006, 2420050007,
                  2420050008, 2420050009, 2420050010, 2420050011, 2420050012, 2421010001, 2421010002, 2421010003,
                  2421010004, 2421010005, 2421010006, 2421020001, 2421020002, 2421020003, 2421020004, 2421020005,
                  2421020006, 2421020007, 2421020008, 2421020009, 2421030001, 2421030002, 2421030003, 2421030004,
                  2421030005, 2421030006, 2421030007, 2421030008, 2421030009, 2421030010, 2421030011, 2421030012,
                  2421030013, 2421030014, 2421040001, 2421040002, 2421040003, 2421040004, 2421040005, 2421050001,
                  2421050002, 2421050003, 2421050004, 2421050005, 2421050006, 2421050007, 2421050008, 2421050009,
                  2421050010, 2421060001, 2421060002, 2421060003, 2421060004, 2421060005, 2421060006, 2421070001,
                  2421070002, 2421070003, 2421070004, 2421070005, 2421070006, 2421070007, 2421070008, 2421080001,
                  2421080002, 2421080003, 2421080004, 2421080005, 2421080006, 2421080007, 2421080008, 2421080009,
                  2421080010, 2421080011, 2421080012, 2421080013, 2421090001, 2421090002, 2421090003, 2421090004,
                  2421090005, 2421090006, 2421090007, 2421090008, 2421090009, 2422010001, 2422010002, 2422010003,
                  2422010004, 2422010005, 2422010006, 2422010007, 2422010008, 2422010009, 2422010010, 2422010011,
                  2422020001, 2422020002, 2422020003, 2422020004, 2422020005, 2422020006, 2422030001, 2422030002,
                  2422030003, 2422030004, 2422030005, 2422030006, 2422030007, 2422030008, 2422040001, 2422040002,
                  2422040003, 2422040004, 2422040005, 2422040006, 2422040007, 2422040008, 2422040009, 2422040010,
                  2422040011, 2422040012, 2422050001, 2422050002, 2422050003, 2422050004, 2422050005, 2422050006,
                  2422050007, 2422050008, 2422050009, 2422050010, 2422050011, 2422050012, 2422050013, 2422050014,
                  2422050015, 2422050016, 2422050017, 2422060001, 2422060002, 2422060003, 2422060004, 2422060005,
                  2422060006, 2422060007, 2422060008, 2422060009, 2422060010, 2422060011, 2422080001, 2422080002,
                  2422080003, 2422080004, 2422080005, 2422080006, 2422080007, 2422080008, 2422080009, 2422080010,
                  2422080011, 2422090001, 2422090002, 2422090003, 2422090004, 2422090005, 2422120001, 2422120002,
                  2422120003, 2422120004, 2422120005, 2422120006, 2422120007, 2422120008, 2422120009, 2422150001,
                  2422150002, 2422150003, 2422150004, 2422150005, 2422150006, 2422150007, 2422150008, 2422150009,
                  2422150010, 2422150011, 2422150012, 2422150013, 2422150014, 2422150015, 2422150016, 2422150017,
                  2422150018, 2422150019, 2422150020, 2422150021, 2422150022, 2422150023, 2422150024, 2422150025,
                  2422150026, 2422150027, 2422150028, 2422150029, 2422150030, 2422150031, 2422150032, 2422150033,
                  2422150034, 2422150035, 2422150036, 2422150037, 2422150038, 2422150039, 2422150040, 2422150041,
                  2422150042, 2422150043, 2422150044, 2423010001, 2423010002, 2423010003, 2423010004, 2423010005,
                  2423010006, 2423010007, 2423010008, 2423010009, 2423010010, 2423010011, 2423010012, 2423010013,
                  2423010014, 2423010015, 2423010016, 2423020001, 2423020002, 2423020003, 2423020004, 2423020005,
                  2423020006, 2423020007, 2423020008, 2423020009, 2423020010, 2423030001, 2423030002, 2423030003,
                  2423030004, 2423030005, 2423030006, 2423030007, 2423030008, 2423030009, 2423030010, 2424010001,
                  2424010002, 2424010003, 2424010004, 2424010005, 2424010006, 2424010007, 2424010008, 2424010009,
                  2424010010, 2424010011, 2424010012, 2424010013, 2424010014, 2424010015, 2424020001, 2424020002,
                  2424020003, 2424020004, 2424020005, 2424020006, 2424020007, 2424020008, 2424020009, 2424020010,
                  2424030001, 2424030002, 2424030003, 2424030004, 2424030005, 2424030006, 2424030007, 2424030008,
                  2424030009, 2424030010, 2424040001, 2424040002, 2424040003, 2424040004, 2424040005, 2424040006,
                  2424040007, 2424040008, 2424040009, 2424040010, 2424050001, 2424050002, 2424050003, 2424050004,
                  2424050005, 2424050006, 2424050007, 2424050008, 2424050009, 2424050010, 2424050011, 2424050012,
                  2424050013, 2424050014, 2424050015, 2424050016, 2424050017, 2424060001, 2424060002, 2424060003,
                  2424060004, 2424060005, 2425010001, 2425010002, 2425010003, 2425010004, 2425010005, 2425010006,
                  2425010007, 2425010008, 2425010009, 2425010010, 2425010011, 2425010012, 2425010013, 2425010014,
                  2425010015, 2425010016, 2425010017, 2425020001, 2425020002, 2425020003, 2425020004, 2425020005,
                  2425020006, 2425020007, 2425020008, 2425020009, 2425020010, 2425020011, 2425030001, 2425030002,
                  2425030003, 2425030004, 2425030005, 2425030006, 2425030007, 2425030008, 2425030009, 2425030010,
                  2425030011, 2425030012, 2425030013, 2425030014, 2425030015, 2425040001, 2425040002, 2425040003,
                  2425040004, 2425040005, 2425040006, 2425040007, 2425040008, 2425040009, 2425040010, 2425040011,
                  2425040012, 2425040013, 2425040014, 2425040015, 2425040016, 2425040017, 2425040018, 2425040019,
                  2425040020, 2425050001, 2425050002, 2425050003, 2425050004, 2425050005, 2425050006, 2425050007,
                  2425050008, 2425050009, 2425050010, 2425050011, 2425050012, 2425050013, 2425050014, 2425050015,
                  2425050016, 2425050017, 2425050018, 2425050019, 2425050020, 2425050021, 2425050022, 2425050023,
                  2425060001, 2425060002, 2425060003, 2425060004, 2425060005, 2425060006, 2425060007, 2426070001,
                  2426070002, 2426070003, 2426070004, 2426070005, 2426100001, 2426100002, 2426100003, 2426100004,
                  2426100005, 2426100006, 2426100007, 2426100008, 2426100009, 2426100010, 2426100011, 2426100012,
                  2426100013, 2426100014, 2426100015, 2426100016, 2426100017, 2426100018, 2426100019, 2426100020,
                  2426100021, 2426110001, 2426110002, 2426110003, 2426110004, 2426110005, 2426110006, 2426110007,
                  2426130001, 2426130002, 2426130003, 2426130004, 2426130005, 2426130006, 2426130007, 2426140001,
                  2426140002, 2426140003, 2426140004, 2426140005, 2426140006, 2426140007, 2426140008, 2426140009,
                  2426140010, 2426140011, 2426140012, 2426140013, 2426150001, 2426150002, 2426150003, 2426150004,
                  2426150005, 2426150006, 2426150007, 2426150008, 2426150009, 2426160001, 2426160002, 2426160003,
                  2426160004, 2426160005, 2426160006, 2427010001, 2427010002, 2427010003, 2427010004, 2427010005,
                  2427010006, 2427010007, 2427010008, 2427010009, 2427010010, 2427010011, 2427010012, 2427010013,
                  2427010014, 2427010015, 2427010016, 2427010017, 2427010018, 2427010019, 2427010020, 2427010021,
                  2427020001, 2427020002, 2427020003, 2427020004, 2427020005, 2427020006, 2427020007, 2427020008,
                  2427020009, 2427020010, 2427020011, 2427020012, 2427020013, 2427020014, 2427020015, 2427020016,
                  2427020017, 2427020018, 2427020019, 2427020020, 2427020021, 2427020022, 2427020023, 2427020024,
                  2427020025, 2427020026, 2427020027, 2427030001, 2427030002, 2427030003, 2427030004, 2427030005,
                  2427030006, 2427030007, 2427030008, 2427030009, 2427030010, 2427030011, 2427030012, 2427030013,
                  2427030014, 2427030015, 2427030016, 2427030017, 2427030018, 2427030019, 2427030020, 2427030021,
                  2427030022, 2427030023, 2427040001, 2427040002, 2427040003, 2427040004, 2427040005, 2427040006,
                  2427040007, 2427040008, 2427040009, 2427040010, 2427040011, 2427040012, 2427040013, 2427050001,
                  2427050002, 2427050003, 2427050004, 2427050005, 2427050006, 2427050007, 2427050008, 2427050009,
                  2427050010, 2427050011, 2427050012, 2427050013, 2427060001, 2427060002, 2427060003, 2427060004,
                  2427060005, 2427060006, 2427060007, 2427060008, 2427060009, 2427060010, 2427060011, 2427060012,
                  2427060013, 2427060014, 2427060015, 2427060016, 2427060017, 2427060018, 2427060019, 2427060020,
                  2427060021, 2427060022, 2428010001, 2428010002, 2428010003, 2428020001, 2428020002, 2428020003,
                  2428020004, 2428030001, 2428030002, 2428030003, 2428030004, 2428030005, 2428030006, 2428030007,
                  2428030008, 2428030009, 2428030010, 2428040001, 2428040002, 2428040003, 2428040004, 2428040005,
                  2428040006, 2428040007, 2428040008, 2428040009, 2429010001, 2429010002, 2429010003, 2429010004,
                  2429010005, 2429010006, 2429010007, 2429010008, 2429010009, 2429010010, 2429010011, 2429010012,
                  2429010013, 2429020001, 2429020002, 2429020003, 2429020004, 2429020005, 2429020006, 2429020007,
                  2429020008, 2429020009, 2429020010, 2429020011, 2429030001, 2429030002, 2429030003, 2429030004,
                  2429030005, 2429030006, 2429030007, 2429030008, 2429030009, 2429030010, 2429030011, 2429030012,
                  2429030013, 2429030014, 2429030015, 2429030016, 2429030017, 2429030018, 2429030019, 2429030020,
                  2429030021, 2429030022, 2429040001, 2429040002, 2429040003, 2429040004, 2429040005, 2429040006,
                  2429040007, 2429040008, 2429040009, 2429040010, 2429040011, 2429040012, 2429040013, 2429040014,
                  2429040015, 2429040016, 2429040017, 2429040018, 2429040019, 2429040020, 2429040021, 2430010001,
                  2430010002, 2430010003, 2430010004, 2430010005, 2430010006, 2430010007, 2430020001, 2430020002,
                  2430020003, 2430020004, 2430020005, 2430020006, 2430020007, 2430020008, 2430020009, 2430020010,
                  2430020011, 2430020012, 2430030001, 2430030002, 2430030003, 2430030004, 2430030005, 2430030006,
                  2430030007, 2430030008, 2430030009, 2430040001, 2430040002, 2430040003, 2430040004, 2430040005,
                  2430040006, 2430040007, 2430040008, 2430040009, 2430040010, 2430040011, 2430040012, 2430050001,
                  2430050002, 2430050003, 2430050004, 2430050005, 2430050006, 2430050007, 2430050008, 2430050009,
                  2430060001, 2430060002, 2430060003, 2430060004, 2430060005, 2430060006, 2430060007, 2430060008,
                  2431010001, 2431010002, 2431010003, 2431010004, 2431010005, 2431010006, 2431010007, 2431010008,
                  2431010009, 2431010010, 2431010011, 2431010012, 2431010013, 2431010014, 2431010015, 2431010016,
                  2431020001, 2431020002, 2431020003, 2431020004, 2431020005, 2431020006, 2431020007, 2431020008,
                  2431020009, 2431020010, 2431020011, 2431030001, 2431030002, 2431030003, 2431030004, 2431030005,
                  2431030006, 2431030007, 2431030008, 2431030009, 2431030010, 2431030011, 2431030012, 2431030013,
                  2431030014, 2431030015, 2431030016, 2431030017, 2431030018, 2431030019, 2431030020, 2431030021,
                  2431030022, 2431030023, 2431030024, 2431030025, 2431030026, 2431030027, 2431030028, 2431040001,
                  2431040002, 2431040003, 2431040004, 2431040005, 2431040006, 2431040007, 2431040008, 2431040009,
                  2431040010, 2431040011, 2431040012, 2431040013, 2431040014, 2431040015, 2431040016, 2431040017,
                  2431040018, 2431040019, 2431040020, 2431040021, 2431040022, 2431040023, 2431040024, 2431040025,
                  2431040026, 2431050001, 2431050002, 2431050003, 2431050004, 2431050005, 2431050006, 2431050007,
                  2431050008, 2431050009, 2431050010, 2431050011, 2431050012, 2431050013, 2431060001, 2431060002,
                  2431060003, 2431060004, 2431060005, 2431060006, 2431060007, 2431060008, 2431060009, 2431060010,
                  2431060011, 2431060012, 2432010001, 2432010002, 2432010003, 2432010004, 2432010005, 2432010006,
                  2432010007, 2432010008, 2432010009, 2432010010, 2432010011, 2432010012, 2432010013, 2432010014,
                  2432010015, 2432010016, 2432010017, 2432010018, 2432010019, 2432020001, 2432020002, 2432020003,
                  2432020004, 2432020005, 2432020006, 2432020007, 2432020008, 2432020009, 2432020010, 2432020011,
                  2432020012, 2432020013, 2432020014, 2432020015, 2432030001, 2432030002, 2432030003, 2432030004,
                  2432030005, 2432030006, 2432030007, 2432030008, 2432030009, 2432030010, 2432030011, 2432030012,
                  2432030013, 2432030014, 2432030015, 2432030016, 2432040001, 2432040002, 2432040003, 2432040004,
                  2432040005, 2432040006, 2432040007, 2432040008, 2432040009, 2432040010, 2432040011, 2432040012,
                  2432040013, 2432040014, 2432040015, 2432040016, 2432040017, 2432040018, 2432040019, 2432050001,
                  2432050002, 2432050003, 2432050004, 2432050005, 2432050006, 2432050007, 2432050008, 2432050009,
                  2432050010, 2432050011, 2432050012, 2432050013, 2432050014, 2432050015, 2432060001, 2432060002,
                  2432060003, 2432060004, 2432060005, 2432060006, 2432060007, 2432060008, 2432060009, 2432060010,
                  2432060011, 2432060012, 2432060013, 2432060014, 2432060015, 2432060016, 2432060017, 2432060018,
                  2433010001, 2433010002, 2433010003, 2433010004, 2433010005, 2433010006, 2433010007, 2433010008,
                  2433010009, 2433010010, 2433010011, 2433010012, 2433010013, 2433010014, 2433010015, 2433010016,
                  2433010017, 2433010018, 2433020001, 2433020002, 2433020003, 2433020004, 2433020005, 2433020006,
                  2433030001, 2433030002, 2433030003, 2433030004, 2433030005, 2433030006, 2433040002, 2433040003,
                  2433040004, 2433040005, 2433040006, 2433040007, 2433040008, 2433040009, 2433040010, 2433040011,
                  2433040012, 2433040013, 2433040014, 2433040015, 2433040016, 2433050001, 2433050002, 2433050003,
                  2433050004, 2433050005, 2433050006, 2433050007, 2433050008, 2433050009, 2433050010]

    def get_cmp_pat_district_files(self,report):
        lst=[]
        for x in GetData.pat_district_id:
            lst.append("pat/{}/2020/districts/{}.json".format(report,x))
        return lst

    def get_cmp_pat_block_files(self,report):
        lst=[]
        for x in GetData.pat_block_id:
            lst.append("pat/{}/2020/blocks/{}.json".format(report,x))
        return lst

    def get_cmp_pat_cluster_files(self,report):
        lst=[]
        for x in GetData.pat_cluster_id:
            lst.append("pat/{}/2020/clusters/{}.json".format(report,x))
        return lst






