import time

from CRC import  crc_report_regression_testing
from Composite_report import composite_regression_testing
from Diksha_Reports.Diksha_charts import  diksha_chart_Regression_testing
from Diksha_Reports.Diksha_column_chart import column_regression_suite
from Diksha_Reports.Diksha_table_report import  diksha_table_regression_testing

from Landing_Page import cQube_landing_page
from Login import login_page
from Periodic_report import periodic_regression_testing
from SAR import  student_attendance_regression_testing
from SI.MAP import  School_Map_regression_testing

from SI.Report import  School_report_regression_testing
from SR import  semester_report_regression_testing
from Semester_Exception import  exception_regression_testing
from Telemetry import telemetry_regression_testing
from UDISE import udise_regression_testing

from get_dir import pwd

import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)


    def test_issue01(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(login_page.login),
        ])
        p = pwd()
        outfile = open(p.get_regression_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='login to cQube regression Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue02(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(cQube_landing_page.cQube_Home),
        ])
        p = pwd()
        outfile = open(p.get_regression_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='cQube landing page regression Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()


    def test_issue03(self):
        self.data.navigate_to_student_report()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the student attendance report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(student_attendance_regression_testing.cQube_Student_Attendance),
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Student Attendance regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue04(self):
        self.data.navigate_to_crc_report()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the crc report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(crc_report_regression_testing.cQube_CRC_Report),
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Crc regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue05(self):
        self.data.navigate_to_semester_report()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the semester report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(semester_report_regression_testing.cQube_Semester_Report),
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue06(self):
        self.data.navigate_to_school_infrastructure_map()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the school infra map report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(School_Map_regression_testing.cQube_SI_Map_Report),

            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra Map regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue07(self):
        self.data.navigate_to_school_infrastructure()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the school infra report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(School_report_regression_testing.cQube_SI_Report)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra regression Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue08(self):
        self.data.navigate_to_diksha_graph()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the diksha chart report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(diksha_chart_Regression_testing.cQube_diskha_chart)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Diksha chart regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue09(self):
        self.data.navigate_to_diksha_table()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the diksha table report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_regression_testing.cQube_diskha_regression)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "w")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Diksha Table regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue10(self):
        self.data.navigate_to_diksha_column_chart()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the diksha column report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(column_regression_suite.cQube_diskha_column_report)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Diksha column regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue11(self):
        self.data.navigate_to_semester_exception()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the semester exception report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(exception_regression_testing.cQube_semester_exception_report)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Exception Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue12(self):
        self.data.navigate_to_telemetry()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the Telemetry  report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    telemetry_regression_testing.Test_Telemetry)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue13(self):
        self.data.navigate_to_udise_report()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the udise  report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    udise_regression_testing.cQube_udise_Report)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Udise Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue14(self):
        self.data.navigate_to_composite_report()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in composite the report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    composite_regression_testing.composite_regression_report)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Composite Report Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue15(self):
        self.data.navigate_to_periodic_report()
        time.sleep(3)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in Periodic the report page")
        else:
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    periodic_regression_testing.periodic_regression)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Periodic Report Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()
