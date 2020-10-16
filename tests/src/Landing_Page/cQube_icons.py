from reuse_func import GetData


class cQube_landing_page():
    def __init__(self,driver):
        self.driver = driver

    def test_SAR(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("sar").click()
        self.cal.page_loading(self.driver)
        if "attendance-report" in self.driver.current_url:
            print("Navigated to Student attendance report")
        else:
            print("Student attendance report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_CRC(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("crcr").click()
        self.cal.page_loading(self.driver)
        if "crc-report" in self.driver.current_url:
            print("Navigated to  CRC report")
        else:
            print("CRC report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_Semester(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("sr").click()
        self.cal.page_loading(self.driver)
        if "semester-report" in self.driver.current_url:
            print("Navigated to  Semester report")
        else:
            print("Semester report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_TAR(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("tar").click()
        self.cal.page_loading(self.driver)
        if "teacher-attendance" in self.driver.current_url:
            print("Navigated to  Teacher coming soon page ")
        else:
            print(" Teacher coming soon page is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_school_map(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("imr").click()
        self.cal.page_loading(self.driver)
        if "school-infra-map" in self.driver.current_url:
            print("Navigated to  School infrastructure map based report")
        else:
            print("School infra map based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_school_chart(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("cr").click()
        self.cal.page_loading(self.driver)
        if "school-infrastructure" in self.driver.current_url:
            print("Navigated to  School infrastructure chart based report")
        else:
            print("School infra chart based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_diksha_chart(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("dsc").click()
        self.cal.page_loading(self.driver)
        if "diksha-chart" in self.driver.current_url:
            print("Navigated to   diksha stacked chart based report")
        else:
            print(" diksha stacked chart  based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_diksha_column(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("dcc").click()
        self.cal.page_loading(self.driver)
        if "diksha-column-chart" in self.driver.current_url:
            print("Navigated to   diksha column based report")
        else:
            print(" diksha column based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_diksha_table(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("dtr").click()
        self.cal.page_loading(self.driver)
        if "diksha-table" in self.driver.current_url:
            print("Navigated to   diksha table based report")
        else:
            print(" diksha table based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)



    def test_telemetry_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("telemData").click()
        self.cal.page_loading(self.driver)
        if "telemetry" in self.driver.current_url:
            print("Navigated to Telemetry report")
        else:
            print("Telemetry  based report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_semester_exception(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("SemExp").click()
        self.cal.page_loading(self.driver)
        if "telemetry" in self.driver.current_url:
            print("Navigated to Semester Exception report")
        else:
            print(" Semester Exception  report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_completionerror(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("isdata").click()
        self.cal.page_loading(self.driver)
        if "download-missing-data" in self.driver.current_url:
            print("Navigated to completion error data page")
        else:
            print("completion error data page report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_udise_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("udise").click()
        self.cal.page_loading(self.driver)
        if "udise-report" in self.driver.current_url:
            print("Navigated to udise report home page")
        else:
            print("udise report home page report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)

    def test_periodic_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("pat").click()
        self.cal.page_loading(self.driver)
        if "pat-report" in self.driver.current_url:
            print("Navigated to peirodic report home page")
        else:
            print("periodic report home page report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)


    def test_composite_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("composite").click()
        self.cal.page_loading(self.driver)
        if "composit-report" in self.driver.current_url:
            print("Navigated to Composite report home page")
        else:
            print("Composite report home page report is not exist")
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)