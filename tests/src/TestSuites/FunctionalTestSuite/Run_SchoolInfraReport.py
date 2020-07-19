import time
from get_dir import pwd
from CRC import crc_report_functional_testing
from SI.MAP import School_Map_functional_testing
from SI.Report import School_report_functional_testing

import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.logger = self.data.get_functional_log("schoolinfrareport")
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
            functional_test = unittest.TestSuite()
            functional_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(School_report_functional_testing.cQube_SI_Report)
            ])
            p= pwd()
            outfile = open(p.get_functional_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra Report Functional Test Report',
                verbosity=1,
            )

            runner1.run(functional_test)
            outfile.close()
            self.logger.info("school infra report execution ended")

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()