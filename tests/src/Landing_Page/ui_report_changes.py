



from reuse_func import GetData


class cQube_All_Reports():
    def __init__(self,driver):
        self.driver = driver

    def test_infrastructure_by_location(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("imr").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        self.cal.page_loading(self.driver)
        print("Report : ",report)
        if 'Infrastructure' in report:
            print('infrastructure_by_location is having proper report name ')
        else:
            print('infrastructure_by_location is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_composite_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("cr").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'Composite Report' in report:
            print('Composite Report is having proper report name ')
        else:
            print('composite report is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_udise_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("udise").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'UDISE' in report:
            print('UDISE is having proper report name ')
        else:
            print('UDISE is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_composite_accross_metrics_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("composite").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'Composite report across matrics' in report:
            print('Composite report across matrics is having proper report name ')
        else:
            print('Composite report across matrics is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_usage_by_course(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("dcc").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'Course linked' in report:
            print('Course linked report across matrics is having proper report name ')
        else:
            print('Course linked report across matrics is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_usage_by_course_content(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("dtr").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'Course linked' in report:
            print('Course linked report across matrics is having proper report name ')
        else:
            print('Course linked report across matrics is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_CRC(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("crcr").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'CRC' in report:
            print('CRC report is having proper report name ')
        else:
            print('CRC attedance is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report




    def test_tpd_course_progress(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("tdp-cp").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'Diksha TPD Course Progress' in report:
            print('Diksha TPD Course Progress is having proper report name ')
        else:
            print('Diksha TPD Course Progress is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_tpd_course_teacher_progress(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='tpd-tp']").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'Diksha TPD Teachers Percentage' in report:
            print('Diksha TPD Teachers Percentage is having proper report name ')
        else:
            print('Diksha TPD Teachers Percentage is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_enrollment_icon(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath("//div[@id='tpd-enroll']").click()
        self.data.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'Diksha TPD report for total enrollments / Completions' in report:
            print('Diksha TPD report for total enrollments / Completions is having proper report name ')
        else:
            print('Diksha TPD report for total enrollments / Completions is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)
        return report

    def test_completion_percentage_icon(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='tpd-comp']").click()
        self.data.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'Diksha TPD report for completion percentage' in report:
            print('Diksha TPD report for completion percentage is having proper report name ')
        else:
            print('Diksha TPD report for completion percentage is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)
        return report

    def test_usage_by_textbook(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='ut']").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'Textbook linked' in report:
            print('Textbook linked report across matrics is having proper report name ')
        else:
            print('Textbook linked report across matrics is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_usage_by_textbook_content(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='utc']").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist_level').text
        if 'Textbook linked' in report:
            print('Textbook linked report across matrics is having proper report name ')
        else:
            print('Textbook linked report across matrics is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_Semester(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("sr").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'CRC' in report:
            print('CRC  is having proper report name ')
        else:
            print('CRC is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_periodic_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("pat").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if "Periodic Assessment Test" in report:
            print('"Periodic Assessment Test" is having proper report name ')
        else:
            print('"Periodic Assessment Test" is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_periodic_heat_chart(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='heatChart']").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if "Periodic Assessment Test LO report" in report:
            print('Periodic Assessment Test LO report is having proper report name ')
        else:
            print('Periodic Assessment Test LO report is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_periodic_lo_table(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='lotable']").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if "Periodic Assessment Test LO report" in report:
            print('Periodic Assessment Test LO report is having proper report name ')
        else:
            print('Periodic Assessment Test LO report is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_semester_exception(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("SemExp").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if "Semester exception" in report:
            print('Semester exception is having proper report name ')
        else:
            print('Semester exception is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_completionerror(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("isdata").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('heading').text
        if 'Download missing data' in report:
            print('Download missing data is having proper report name ')
        else:
            print('Download missing data is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

    def test_SAR(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("sar").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'Attendance' in report:
            print('Student Attedance is having proper report name ')
        else:
            print('Student Attendance data is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report

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

    def test_telemetry_report(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("telemData").click()
        self.cal.page_loading(self.driver)
        report = self.driver.find_element_by_id('dist').text
        if 'Telemetry data for' in report:
            print('Telemetry is having proper report name ')
        else:
            print('Telemetry report is not having not proper ')
        self.driver.find_element_by_id("homeBtn").click()
        self.cal.page_loading(self.driver)
        return report






