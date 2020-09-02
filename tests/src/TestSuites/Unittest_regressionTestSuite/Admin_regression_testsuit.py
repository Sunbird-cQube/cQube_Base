from Admin_console import check_admin_landing_page, \
    Logs_scripts, S3_files_script, Summary_Report
from get_dir import pwd


import unittest
from HTMLTestRunner import HTMLTestRunner

class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(check_admin_landing_page.Test_admin_landing_page),
                unittest.defaultTestLoader.loadTestsFromTestCase(Logs_scripts.Test_logs),
                unittest.defaultTestLoader.loadTestsFromTestCase(S3_files_script.Test_s3files),
                unittest.defaultTestLoader.loadTestsFromTestCase(Summary_Report.Test_summaryreport)
        ])
        p= pwd()
        outfile = open(p.get_admin_login_path(), "w")
        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Regression Test Report',
            verbosity=1,
            description="Admin login  Test Result "
        )

        runner1.run(functional_test)
        outfile.close()


if __name__ == '__main__':
    unittest.main()