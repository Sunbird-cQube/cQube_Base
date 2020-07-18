import time

from CRC import crc_report_sanity_testing
from get_dir import pwd
import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.logger = self.data.get_functional_log("crc")
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)


    def test_Issue(self):

        self.data.navigate_to_crc_report()
        time.sleep(2)
        self.errMsg = self.data.get_data_status()
        if self.errMsg.text == 'No data found':
            print("No data in the crc report page")
        else:
            self.logger.info("crc report execution started")

            functional_test = unittest.TestSuite()
            functional_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(crc_report_sanity_testing.cQube_CRC_Report),
            ])
            p= pwd()
            outfile = open(p.get_sanity_report_path(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='CRC Sanity Test Report',
                verbosity=1,
            )

            runner1.run(functional_test)
            outfile.close()
            self.logger.info("crc report execution ended")


    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()