
import time

from Telemetry import telemetry_scripts
from get_dir import pwd
import unittest
from HTMLTestRunner import HTMLTestRunner



class MyTestSuite(unittest.TestCase):


    def test_Issue(self):

            functional_test = unittest.TestSuite()
            functional_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(telemetry_scripts.Test_Telemetry),
            ])
            p= pwd()
            outfile = open(p.get_functional_report_path(), "w")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry Test Report',
                verbosity=1,
            )

            runner1.run(functional_test)
            outfile.close()


    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()