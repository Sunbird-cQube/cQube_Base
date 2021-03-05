import configparser
import json
import os
import time
from datetime import date

import psycopg2
import requests
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, WebDriverException
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

    def get_current_date(self):
        today = date.today()
        todaydate = today.strftime('%d-%m-%Y')
        return todaydate

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
        try:
            self.driver.get(self.get_domain_name())
        except WebDriverException:
                print("page down")
        self.driver.implicitly_wait(60)

    def login_cqube(self, driver):
        self.driver = driver
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_name(Data.email).send_keys(self.get_username())
        self.driver.find_element_by_name(Data.passwd).send_keys(self.get_password())
        self.driver.find_element_by_id(Data.login).click()
        self.page_loading(self.driver)
        self.driver.find_element_by_tag_name('button').click()
        self.page_loading(self.driver)

    def login_to_adminconsole(self, driver):
        self.driver = driver
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.email).send_keys(self.get_admin_username())
        self.driver.find_element_by_id(Data.passwd).send_keys(self.get_admin_password())
        self.driver.find_element_by_id(Data.login).click()
        self.page_loading(self.driver)
        self.driver.find_element_by_id("admin_console").click()
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

    def navigate_to_sat_heatchart_report(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.semester_sel).click()
        time.sleep(2)
        self.driver.find_element_by_id("satHeatChart").click()
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


    def get_month_and_year_values(self):
        year = self.driver.find_element_by_id('year').text
        month = self.driver.find_element_by_id('month').text
        return year , month

    def get_student_month_and_year_values(self):
        times = Select(self.driver.find_element_by_id('period'))
        times.select_by_visible_text(' Year and Month ')
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        self.year = (year.first_selected_option.text).strip()
        self.month = (month.first_selected_option.text).strip()
        return self.year,self.month

    def get_pat_month_and_year_values(self):
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        self.year = (year.first_selected_option.text).strip()
        self.month = (month.first_selected_option.text).strip()
        return self.year, self.month

    def pat_month_and_year_values(self):
        year = Select(self.driver.find_element_by_id('year'))
        month = Select(self.driver.find_element_by_id('month'))
        self.year = (year.first_selected_option.text).strip()
        self.month = (month.first_selected_option.text).strip()
        return self.year,self.month

    def navigate_to_student_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.attendance).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.SAR).click()
        time.sleep(6)

    def navigate_to_teacher_attendance_report(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.attendance).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.teacher).click()
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
        self.driver.find_element_by_id("sat").click()
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
        self.driver.find_element_by_xpath("//a[@id='tpd-comp']").click()
        time.sleep(6)

    def navigate_to_health_card_index(self):
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath("//a[@id='healthCard']").click()
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

    def navigate_to_pat_exception(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.exception_click).click()
        time.sleep(2)
        self.driver.find_element_by_id('patexp').click()
        time.sleep(5)

    def navigate_to_teacher_exception(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.exception_click).click()
        time.sleep(2)
        self.driver.find_element_by_id('tarExcpt').click()
        time.sleep(5)

    def navigate_to_student_exception(self):
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.exception_click).click()
        time.sleep(2)
        self.driver.find_element_by_id('sarExp').click()
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








