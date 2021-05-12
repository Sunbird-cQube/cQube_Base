import unittest

from HTMLTestRunner import HTMLTestRunner

from Exceptions_Reports.Student_Exception import student_exception_functional_testing
from Exceptions_Reports.Teacher_Exception import teacher_exception_functional_test
from Health_Card_Index import health_card_regression_test, Health_card_functional_Test
from Student_Attendance import student_timeseries
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_issue01(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(student_exception_functional_testing.cQube_Student_Attendance_exception),
            ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Student Exception functional Test Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue02(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(teacher_exception_functional_test.cQube_teacher_exception_functional_report),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Teacher Exception functional Test Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue03(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(student_timeseries.cQube_Student_Attendance),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Student Time series functional Test Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


if __name__ == '__main__':
    unittest.main()
