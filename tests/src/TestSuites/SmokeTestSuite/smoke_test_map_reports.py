




from Landing_Page import cQube_landing_page
from Login import login_page
from Periodic_Test_Reports.Periodic_report import periodic_smoke_testing
from Student_Attendance import student_attendance_smoke_testing
from SI.MAP import School_Map_smoke_testing

from Semester import semester_report_smoke_testing
from Exceptions_Reports.Semester_Exception import exception_smoke_testing
from Teacher_Attendance import teacher_attendance_smoke_testing
from Telemetry import telemetry_smoke_testing
from UDISE import udise_smoke_testing

from get_dir import pwd

import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite_Smoke_map_reports(unittest.TestCase):

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
        outfile = open(p.get_smoke_map_report(), "w")

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
        outfile = open(p.get_smoke_map_report(), "a")

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
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Student Attendance Smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

   
    def test_issue04(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(semester_report_smoke_testing.cQube_Semester_Report),
            ])
            p = pwd()
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue05(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(School_Map_smoke_testing.cQube_SI_Map_Report),

            ])
            p = pwd()
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra Map Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    



    def test_issue06(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    exception_smoke_testing.cQube_semester_exception_report)
            ])
            p = pwd()
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Exception Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue07(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    telemetry_smoke_testing.Test_Telemetry)
            ])
            p = pwd()
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

    def test_issue08(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    udise_smoke_testing.cQube_udise_Report)
            ])
            p = pwd()
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='UDISE Report smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()

   
    def test_issue09(self):

            smoke_test = unittest.TestSuite()
            smoke_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    periodic_smoke_testing.periodic_smoke)
            ])
            p = pwd()
            outfile = open(p.get_smoke_map_report(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Periodic Report Smoke Test Report',
                verbosity=1,

            )

            runner1.run(smoke_test)
            outfile.close()


    def test_issue10(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                teacher_attendance_smoke_testing.cQube_Teacher_Attendance_SmokeTest
            )
        ])
        p = pwd()
        outfile = open(p.get_smoke_map_report(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Teacher Attendance Report Smoke Test Report',
            verbosity=1,

        )
        runner1.run(smoke_test)
        outfile.close()

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()
