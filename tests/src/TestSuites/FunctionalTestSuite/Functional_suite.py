import unittest

from HTMLTestRunner import HTMLTestRunner

from Composite_report import composite_functional_testing
from Periodic_report import periodic_functional_suite
from get_dir import pwd


class MyTestSuite(unittest.TestCase):


    def test_issue01(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(composite_functional_testing.composite_report),
            ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Composite Report functional Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue02(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(periodic_functional_suite.periodic_functional_testing),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Periodic Report functional Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


if __name__ == '__main__':
    unittest.main()
