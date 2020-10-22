from Admin_console import admin_console_system_testing, admin_console_regression_testing, admin_console_smoke_testing
from get_dir import pwd


import unittest
from HTMLTestRunner import HTMLTestRunner

class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
        unittest.defaultTestLoader.loadTestsFromTestCase(admin_console_smoke_testing.Admin_console_smoketest),
        unittest.defaultTestLoader.loadTestsFromTestCase(admin_console_system_testing.adminconsole_system_test),
        unittest.defaultTestLoader.loadTestsFromTestCase(admin_console_regression_testing.Admin_console_regression),

        ])
        p= pwd()
        outfile = open(p.get_system_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='System Test Report',
            verbosity=1,
            description="Admin Test Result "
        )

        runner1.run(functional_test)
        outfile.close()


if __name__ == '__main__':
    unittest.main()