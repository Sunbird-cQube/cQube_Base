import unittest

from Diksha_Reports.usage_by_course import usage_by_course_regression_suite
from Diksha_Reports.usage_by_textbook import usage_by_textbook_regression_suite
from Diksha_Reports.content_course import content_course_regression_suite
from Diksha_Reports.content_textbook import content_textbook_regression_suite
from Diksha_TPD.TPD_Completion_percentage import completion_regression_test
from Diksha_TPD.TPD_Enrollment_completion import enrollment_regression_test
from Diksha_TPD.TPD_Course_Progress import lpd_content_regression_test
from Diksha_TPD.TPD_Teacher_Percentage import lpd_percentage_regression_test
from Pat_Heatchart import patheatchart_regression_test
from get_dir import pwd
from pat_LO_Table import PAT_LO_Table_regression_suite
from reuse_func import GetData
from HTMLTestRunner import HTMLTestRunner


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
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    patheatchart_regression_test.cQube_heatchart_regression_test
                    )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title=' PAT Heat chart Report Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()

    def test_issue02(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    PAT_LO_Table_regression_suite.cQube_pat_lotable_regression_test
                )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title=' PAT LO Table Report Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()

    def test_issue03(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                content_course_regression_suite.cQube_content_course_regression)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Content BY Course Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()

    def test_issue04(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    content_textbook_regression_suite.cQube_content_textbook_regression
                )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Content By Textbook report Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()

    def test_issue05(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    usage_by_course_regression_suite.cQube_diskha_course_regression_report
                )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title=' Usage By Course Report Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()

    def test_issue06(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    usage_by_textbook_regression_suite.cQube_usage_textbook_regression_report
                )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title=' Usage By Textbook Report Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()
    def test_issue07(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    lpd_content_regression_test.cQube_lpdcontent_regression_Test
                )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='TPD Collection Progress Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()


    def test_issue08(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(
                    lpd_percentage_regression_test.cQube_lpdpercentage_regression_Test
                )
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='TPD Percentage Progress Regression Test Report',
                verbosity=1,

            )
            runner1.run(regression_test)
            outfile.close()
    def test_issue09(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                enrollment_regression_test.cQube_enrollment_regression
            )
        ])
        p = pwd()
        outfile = open(p.get_regression_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='TPD Enrollment Regression Test Report',
            verbosity=1,
        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue10(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                completion_regression_test.cQube_completion_percentage_regression
            )
        ])
        p = pwd()
        outfile = open(p.get_regression_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='TPD Completion percentage Regression Test Report',
            verbosity=1,
        )
        runner1.run(regression_test)
        outfile.close()
    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()