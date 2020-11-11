import unittest

from HTMLTestRunner import HTMLTestRunner

from Diksha_TPD.lpd_heat_chart import lpd_content_functional_test
from Diksha_TPD.percentage_heat_chart import lpd_percentage_functional_test
from Pat_Heatchart import heatchart_functional_suite
from get_dir import pwd
from pat_LO_Table import LO_Table_functional_suite


class MyTestSuite(unittest.TestCase):

    def test_issue01(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(heatchart_functional_suite.cQube_heatchart_functionalTest),
            ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='PAT Heat chart functional Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue02(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(LO_Table_functional_suite.cQube_LOTable_fuuctionalTest),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='PAT LO Table functional Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue03(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(lpd_content_functional_test.cQube_heatchart_functionalTest),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Diksha TPD Collection  functional Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue04(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(lpd_percentage_functional_test.cQube_chart_percentage_functionalTest),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='TPD Teacher Progress functional Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()
    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


if __name__ == '__main__':
    unittest.main()
