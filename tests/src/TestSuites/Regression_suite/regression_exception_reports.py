import unittest

from HTMLTestRunner import HTMLTestRunner

from Exceptions_Reports.Periodic_Exception import regression_pat_exception
from Exceptions_Reports.Semester_Exception import exception_regression_testing
from Exceptions_Reports.Student_Exception import regression_student_exception
from Exceptions_Reports.Teacher_Exception import regression_teacher_exception
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
                    exception_regression_testing.cQube_semester_exception_report)
            ])
            p = pwd()
            outfile = open(p.get_regression_map_reports(), "w")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Semester Exception Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    def test_issue02(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                regression_student_exception.cQube_regression_Student_exception)
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Student Exception Regression Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()

    def test_issue03(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                regression_teacher_exception.cQube_teacher_exception_regression_report)
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Teacher Exception Regression Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()

    def test_issue04(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                regression_pat_exception.cQube_pat_exception_regression_report)
        ])
        p = pwd()
        outfile = open(p.get_regression_map_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='PAT Exception Regression Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()
