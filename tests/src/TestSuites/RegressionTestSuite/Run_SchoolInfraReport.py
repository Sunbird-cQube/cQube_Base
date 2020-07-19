import time

from get_dir import pwd
from SI.Report import School_report_regression_testing

import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.logger = self.data.get_regression_log("schoolinfrareport")
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)

    def test_Issue(self):
        self.data.navigate_to_school_infrastructure()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the school infrastructure report page")
        else:
            self.logger.info("school infra report execution started")
            regression_test = unittest.TestSuite()
            regression_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(School_report_regression_testing.cQube_SI_Report)
            ])
            p = pwd()
            outfile = open(p.get_regression_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infrastructure Report Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()
            self.logger.info("school infra report execution started")

    @classmethod
    def tearDownClass(self):
        self.driver.close()


if __name__ == '__main__':
    unittest.main()