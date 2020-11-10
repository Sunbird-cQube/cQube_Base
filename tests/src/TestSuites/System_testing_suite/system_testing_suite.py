import unittest
from HTMLTestRunner import HTMLTestRunner

from CRC import crc_report_system_testing
from Composite_report import composite_system_testing
from Diksha_Reports.Diksha_charts import diksha_chart_system_testing

from Login import login_page
from Periodic_report import periodic_system_suite
from SAR import student_attendance_system_testing
from SI.MAP import school_map_system_testing
from SI.Report import school_report_system_testing

from SR import semester_report_system_testing
from Semester_Exception import exception_system_testing
from Telemetry import telemetry_system_testing
from UDISE import udise_system_testing

from get_dir import pwd
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
        system_test = unittest.TestSuite()
        system_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(login_page.login),
        ])
        p = pwd()
        outfile = open(p.get_system_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='login to cQube system Test Report',
            verbosity=1,
        )
        runner1.run(system_test)
        outfile.close()

    def test_issue03(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(student_attendance_system_testing.cQube_Student_Attendance),
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Student Attendance System Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue04(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(crc_report_system_testing.crc_System_Testing),
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='CRC System Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue05(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(semester_report_system_testing.cQube_Semester_Report),
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester System Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue06(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(school_map_system_testing.cQube_SI_Map_Report),
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infrastructure Map system Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue07(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(school_report_system_testing.cQube_SI_Report)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infrastructre scattor plot system Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue08(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(diksha_chart_system_testing.cQube_diskha_chart)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Diksha chart system Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()



    def test_issue11(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(exception_system_testing.cQube_semester_exception_report)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Exception system Test Report',
                verbosity=1,

            )
            runner1.run(system_test)
            outfile.close()

    def test_issue12(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    telemetry_system_testing.Test_Telemetry)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry system Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue13(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    udise_system_testing.cQube_udise_Report)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Udise System Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue14(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    composite_system_testing.composite_system_report)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Composite Report system Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()

    def test_issue15(self):
            system_test = unittest.TestSuite()
            system_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    periodic_system_suite.periodic_system_testing)
            ])
            p = pwd()
            outfile = open(p.get_system_report_path(), "a")
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Periodic Report System Test Report',
                verbosity=1,
            )
            runner1.run(system_test)
            outfile.close()


    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()
