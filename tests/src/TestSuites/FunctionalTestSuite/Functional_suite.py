import unittest

from HTMLTestRunner import HTMLTestRunner

from Pat_Heatchart import heatchart_functional_suite
from get_dir import pwd


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




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


if __name__ == '__main__':
    unittest.main()
