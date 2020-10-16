import unittest

from Landing_Page.cQube_icons import cQube_landing_page
from reuse_func import GetData

class cQube_Home(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)


    def test_sar_icon(self):
        b =cQube_landing_page(self.driver)
        result = b.test_SAR()
        self.data.page_loading(self.driver)

    def test_crc_icon(self):
        b =cQube_landing_page(self.driver)
        result = b.test_CRC()
        self.data.page_loading(self.driver)

    def test_semester_icon(self):
        b =cQube_landing_page(self.driver)
        result = b.test_Semester()
        self.data.page_loading(self.driver)

    def test_tar_icon(self):
        b =cQube_landing_page(self.driver)
        result = b.test_TAR()
        self.data.page_loading(self.driver)

    def test_school_map_icon(self):
        b =cQube_landing_page(self.driver)
        result = b.test_school_map()
        self.data.page_loading(self.driver)

    def test_school_chart_icon(self):
        b =cQube_landing_page(self.driver)
        result = b.test_school_chart()
        self.data.page_loading(self.driver)

    def test_diksha_chart_icon(self):
        b = cQube_landing_page(self.driver)
        result = b.test_diksha_chart()
        self.data.page_loading(self.driver)

    def test_diksha_table(self):
        b = cQube_landing_page(self.driver)
        res = b.test_diksha_table()
        self.data.page_loading(self.driver)

    def test_diksha_column(self):
        b = cQube_landing_page(self.driver)
        res = b.test_diksha_column()
        self.data.page_loading(self.driver)

    def test_sem_exception(self):
        b = cQube_landing_page(self.driver)
        res = b.test_diksha_column()
        self.data.page_loading(self.driver)

    def test_telemetry_icon(self):
        b = cQube_landing_page(self.driver)
        result = b.test_telemetry_report()
        self.data.page_loading(self.driver)

    def test_completionerror(self):
        b = cQube_landing_page(self.driver)
        res = b.test_completionerror()
        self.data.page_loading(self.driver)

    def test_compositeReport(self):
        b = cQube_landing_page(self.driver)
        res = b.test_composite_report()
        self.data.page_loading(self.driver)

    def test_patreport(self):
        b = cQube_landing_page(self.driver)
        res = b.test_periodic_report()
        self.data.page_loading(self.driver)

    def test_udisereport(self):
        b = cQube_landing_page(self.driver)
        res = b.test_udise_report()
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()