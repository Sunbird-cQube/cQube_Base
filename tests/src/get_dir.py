import os


class pwd():

    def get_system_path(self):
        pwd = os.path.dirname(__file__)
        return pwd

    def get_admin_login_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/admin_screens_report.html')
        return report_path

    def get_admin_console_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/functional_report.html')
        return report_path

    def get_semester_exception_download_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/semester_exception.html')
        return report_path

    def get_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/report.html')
        return report_path

    def get_sanity_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/SanityReports/sanity_testing_report.html')
        return report_path

    def get_regression_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/Regression_Report/Regression_new.html')
        return report_path

    def get_smoke_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/SmokeReport/SmokeTest.html')
        return report_path

    def get_functional_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/Admin_Console.html')
        return report_path

    def get_integration_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/integration_report.html')
        return report_path

    def get_system_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/systemTest.html')
        return report_path

    def get_config_ini_path(self):
        cwd = os.path.dirname(__file__)
        ini = os.path.join(cwd, 'config.ini')
        return ini

    def get_summary_statistics_path(self):
        cwd = os.path.dirname(__file__)
        key = os.path.join(cwd, 'summary_variables.ini')
        return key

    def get_driver_path(self):
        cwd = os.path.dirname(__file__)
        driver_path = os.path.join(cwd, 'Driver/chromedriver')
        return driver_path

    def get_firefox_driver_path(self):
        cwd = os.path.dirname(__file__)
        driver_path = os.path.join(cwd, 'Driver/geckodriver')
        return driver_path

    def get_screenshot_path(self):
        swd = os.path.dirname(__file__)
        image_path = os.path.join(swd, 'Screenshots/demo.png')
        return image_path

    def get_download_dir(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads')
        return download_path

    def get_download_dir_SAR_Download1(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SAR_Download1')
        return download_path

    def get_download_dir_SAR_Download2(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SAR_Download2')
        return download_path

    def get_download_dir_SAR_Download3(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SAR_Download3')
        return download_path

    def get_download_dir_SAR_Download4(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SAR_Download4')
        return download_path

    def get_download_dir_SR_Download1(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SR_Download1')
        return download_path

    def get_download_dir_SR_Download2(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SR_Download2')
        return download_path
    def get_download_dir_SR_Download3(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SR_Download3')
        return download_path

    def get_download_dir_SR_Download4(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SR_Download4')
        return download_path

    def get_download_dir_CRC_Download1(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/CRC_Download1')
        return download_path

    def get_download_dir_CRC_Download2(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/CRC_Download2')
        return download_path
    def get_download_dir_CRC_Download3(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/CRC_Download3')
        return download_path

    def get_download_dir_CRC_Download4(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/CRC_Download4')
        return download_path

    def get_download_dir_SI_Download1(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_Download1')
        return download_path

    def get_download_dir_SI_Download2(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_Download2')
        return download_path

    def get_download_dir_SI_Download3(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_Download3')
        return download_path

    def get_download_dir_SI_Download4(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_Download4')
        return download_path

    def get_download_dir_SI_MAP_Download1(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_MAP_Download1')
        return download_path

    def get_download_dir_SI_MAP_Download2(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_MAP_Download2')
        return download_path

    def get_download_dir_SI_MAP_Download3(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_MAP_Download3')
        return download_path

    def get_download_dir_SI_MAP_Download4(self):
        cwd = os.path.dirname(__file__)
        download_path = os.path.join(cwd, 'Downloads/SI_MAP_Download4')
        return download_path

    # def get_functional_testing_log_dir(self):
    #     cwd = os.path.dirname(__file__)
    #     log_dir_path = os.path.join(cwd, 'Logs/test_functional_testing.log')
    #     return log_dir_path

    def get_sanity_testing_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/test_sanity_testing.log')
        return log_dir_path

    def get_smoke_testing_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/test_smoke_testing.log')
        return log_dir_path

    # def get_regression_testing_log_dir(self):
    #     cwd = os.path.dirname(__file__)
    #     log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/test_regression_testing.log')
    #     return log_dir_path



    def get_regression_testing_login_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/login.log')
        return log_dir_path

    def get_regression_testing_student_attendance_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/student_attendance.log')
        return log_dir_path


    def get_regression_testing_crc_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/crc.log')
        return log_dir_path

    def get_regression_testing_semester_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/semester.log')
        return log_dir_path

    def get_regression_testing_schoolinfra_map_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/schoolinfra_map.log')
        return log_dir_path

    def get_regression_testing_schoolinfra_report_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/RegressionLogs/schoolinfra_report.log')
        return log_dir_path

    def get_functional_testing_login_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/FunctionalLogs/login.log')
        return log_dir_path

    def get_functional_testing_student_attendance_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/FunctionalLogs/student_attendance.log')
        return log_dir_path


    def get_functional_testing_crc_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/FunctionalLogs/crc.log')
        return log_dir_path

    def get_functional_testing_semester_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/FunctionalLogs/semester.log')
        return log_dir_path

    def get_functional_testing_schoolinfra_map_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/FunctionalLogs/schoolinfra_map.log')
        return log_dir_path

    def get_functional_testing_schoolinfra_report_log_dir(self):
        cwd = os.path.dirname(__file__)
        log_dir_path = os.path.join(cwd, 'Logs/FunctionalLogs/schoolinfra_report.log')
        return log_dir_path

    def get_clear_fields(self, driver):
        self.driver = driver
        self.driver.find_element_by_id("fname").clear()
        self.driver.find_element_by_id("mname").clear()
        self.driver.find_element_by_id("lname").clear()
        self.driver.find_element_by_id("email").clear()
        self.driver.find_element_by_id("designattion").clear()
        self.driver.find_element_by_id("passswd").clear()

    def get_s3_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/s3FilesCheck.html')
        return report_path

    def get_nifi_processor_group_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Reports/cQubeConfiguration.html')
        return report_path
