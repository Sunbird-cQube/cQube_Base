import os
import time

from CRC import crc_report_smoke_testing
from Landing_Page import cQube_home_page
from Login import login_smoke_testing
from SAR import student_attendance_smoke_testing
from SI.MAP import School_Map_smoke_testing
from SI.Report import School_report_smoke_testing
from SR import semester_report_smoke_testing

from get_dir import pwd

import unittest
from fileinput import close
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.logger = self.data.get_smoke_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)

    def test_issue01(self):
        self.logger.info("Login execution started")
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(login_smoke_testing.cQube_Login_smoke_Test),
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
        self.logger.info("Login execution ended")

    def test_issue07(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(cQube_home_page.cQube_Home),
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



    def test_issue02(self):
        self.data.navigate_to_student_report()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the student attendance report page")
        else:
            self.logger.info("student attendance report execution started")
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
            self.logger.info("student attendance report execution ended")

    def test_issue03(self):
        self.data.navigate_to_crc_report()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the crc report page")
        else:
            self.logger.info("crc report execution started")
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
            self.logger.info("crc report execution ended")

    def test_issue04(self):
        self.data.navigate_to_semester_report()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the semester report page")
        else:
            self.logger.info("semester report execution started")
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
            self.logger.info("semester report execution ended")

    def test_issue05(self):
        self.data.navigate_to_school_infrastructure_map()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the school infra map report page")
        else:
            self.logger.info("school infrastructure map report execution started")
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
            self.logger.info("school infra map report execution ended")

    def test_issue06(self):
        self.data.navigate_to_school_infrastructure()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the school infra report page")
        else:
            self.logger.info("school infrastructure report execution started")
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
            self.logger.info("school infra report execution started")

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()
