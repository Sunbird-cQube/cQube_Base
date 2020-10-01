import unittest
from HTMLTestRunner import HTMLTestRunner

from Backlog_scripts import cQube_landing_page, check_admin_landing_page, udise_summary
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):

            functional_test = unittest.TestSuite()
            functional_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(cQube_landing_page.cQube_Home),
                unittest.defaultTestLoader.loadTestsFromTestCase(check_admin_landing_page.Test_admin_landing_page),
                unittest.defaultTestLoader.loadTestsFromTestCase(udise_summary.Test_summaryreport),
            ])
            p= pwd()
            outfile = open(p.get_admin_console_path(), "w")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='User creation  Test Report',
                verbosity=1,
            )

            runner1.run(functional_test)

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()