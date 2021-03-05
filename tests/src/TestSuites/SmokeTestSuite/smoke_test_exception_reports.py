import unittest

from HTMLTestRunner import HTMLTestRunner

from Exceptions_Reports.Periodic_Exception import regression_pat_exception, smoke_pat_exception
from Exceptions_Reports.Semester_Exception import exception_regression_testing, exception_smoke_testing
from Exceptions_Reports.Student_Exception import regression_student_exception, smoke_student_exception
from Exceptions_Reports.Teacher_Exception import regression_teacher_exception, smoke_teacher_exception
from get_dir import pwd
from reuse_func import GetData


class MyTestSuite_Exception(unittest.TestCase):

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
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    exception_smoke_testing.cQube_semester_exception_report)
            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Exception Smoke Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue02(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                smoke_student_exception.cQube_smoke_Student_exception)
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Student Exception Smoke Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()

    def test_issue03(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                smoke_teacher_exception.cQube_teacher_exception_smoke_report)
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Teacher Exception Smoke Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()

    def test_issue04(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                smoke_pat_exception.cQube_pat_exception_smoke_report)
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='PAT Exception Smoke Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()
