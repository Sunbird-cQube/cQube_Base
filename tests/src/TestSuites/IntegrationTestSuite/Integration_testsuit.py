import time
import unittest

from CRC import crc_integration_testing
from Landing_Page import cQube_home_page
from Login import login_integration_script
from HTMLTestRunner import HTMLTestRunner

from SAR import student_attendance_integration_testing
from SI.MAP import school_map_integration_testing
from SI.Report import si_chart_integration_testing
from SR import semester_integration_testing
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):

        regression_test = unittest.TestSuite()
        regression_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(login_integration_script.cQube_Login_integration_Test),
                unittest.defaultTestLoader.loadTestsFromTestCase(cQube_home_page.cQube_Home),
                unittest.defaultTestLoader.loadTestsFromTestCase(crc_integration_testing.cQube_CRC_Report),
                unittest.defaultTestLoader.loadTestsFromTestCase(student_attendance_integration_testing.cQube_sar_integration_Test),
                unittest.defaultTestLoader.loadTestsFromTestCase(semester_integration_testing.cQube_semester_integration_Test),
                unittest.defaultTestLoader.loadTestsFromTestCase(school_map_integration_testing.cQube_School_map_integration_Test),
                unittest.defaultTestLoader.loadTestsFromTestCase(si_chart_integration_testing.cQube_si_Report),

            ])
        p = pwd()
        outfile = open(p.get_integration_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Integration Test Report',
                verbosity=1,

            )

        runner1.run(regression_test)




    def tearDown(self):
        self.driver.close()


if __name__ == '__main__':
    unittest.main()