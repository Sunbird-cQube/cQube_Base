import time

from CRC import crc_report_smoke_testing
from Composite_report import composite_smoke_testing
from Diksha_Reports.Diksha_charts import diksha_chart_smoke_testing

from Landing_Page import cQube_landing_page
from Login import login_page
from Periodic_report import periodic_smoke_testing
from SAR import student_attendance_smoke_testing
from SI.MAP import School_Map_smoke_testing

from SI.Report import School_report_smoke_testing
from SR import semester_report_smoke_testing
from Semester_Exception import exception_smoke_testing
from Telemetry import telemetry_smoke_testing
from UDISE import udise_smoke_testing

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
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(login_page.login),
        ])
        p = pwd()
        outfile = open(p.get_smoke_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Smoke Test Report',
            verbosity=1,

        )
        runner1.run(smoke_test)
        outfile.close()

    def test_issue02(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(cQube_landing_page.cQube_Home),
        ])
        p = pwd()
        outfile = open(p.get_smoke_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='cQube landing page Report',
            verbosity=1,

        )
        runner1.run(smoke_test)
        outfile.close()


    def test_issue03(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(student_attendance_smoke_testing.cQube_Student_Attendance),
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Student Attendance Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue04(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(crc_report_smoke_testing.cQube_CRC_Report),
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Crc Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue05(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(semester_report_smoke_testing.cQube_Semester_Report),
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue06(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(School_Map_smoke_testing.cQube_SI_Map_Report),

            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra Map Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue07(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(School_report_smoke_testing.cQube_SI_Report)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue08(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(diksha_chart_smoke_testing.cQube_diskha_chart)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Diksha chart Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()



    def test_issue10(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(exception_smoke_testing.cQube_semester_exception_report)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Exception Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue11(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    telemetry_smoke_testing.Test_Telemetry)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue13(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    udise_smoke_testing.cQube_udise_Report)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='UDISE Report smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue14(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    composite_smoke_testing.composite_smoke_testing)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Composite Report smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue15(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    periodic_smoke_testing.periodic_smoke)
            ])
            p = pwd()
            outfile = open(p.get_smoke_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Periodic Report Smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()
