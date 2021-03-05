


from Landing_Page import cQube_landing_page
from Login import login_page

from Periodic_Test_Reports.Periodic_report import periodic_regression_testing
from Student_Attendance import  student_attendance_regression_testing
from SI.MAP import  School_Map_regression_testing

from Semester import  semester_report_regression_testing
from Teacher_Attendance import teacher_attendance_regression_testing
from Telemetry import telemetry_regression_testing
from UDISE import udise_regression_testing

from get_dir import pwd

import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite_cQube_map_reports(unittest.TestCase):

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
        outfile = open(p.get_regression_map_reports(), "w")

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
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='cQube landing page regression Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()


    def test_issue03(self):

                regression_test = unittest.TestSuite()
                regression_test.addTests([
                    # file name .class name
                    unittest.defaultTestLoader.loadTestsFromTestCase(student_attendance_regression_testing.cQube_Student_Attendance_regression),
                ])
                p = pwd()
                outfile = open(p.get_regression_map_reports(), "a")

                runner1 = HTMLTestRunner.HTMLTestRunner(
                    stream=outfile,
                    title='Student Attendance regression Test Report',
                    verbosity=1,

                )

                runner1.run(regression_test)
                outfile.close()



    def test_issue04(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(semester_report_regression_testing.cQube_Semester_Report),
            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue05(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(School_Map_regression_testing.cQube_SI_Map_Report),

            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infrastructure Map regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()
 


    def test_issue07(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(telemetry_regression_testing.Test_Telemetry)
            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue08(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(udise_regression_testing.cQube_udise_Report)
            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Udise Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()



    def test_issue09(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    periodic_regression_testing.periodic_regression)
            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Periodic Report Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue10(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                teacher_attendance_regression_testing.cQube_Teacher_Attendance_regression
            )
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Teacher Attendance Regression Test Report',
            verbosity=1,
        )
        runner1.run(regression_test)
        outfile.close()
   

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()
