import unittest

from HTMLTestRunner import HTMLTestRunner

from Admin_console import Logs_scripts, S3_files_script, Summary_Report
from Admin_console.User_creation import create_user, login_cqube_with_new_users
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):

            functional_test = unittest.TestSuite()
            functional_test.addTests([
                # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(create_user.Creating_users),
                unittest.defaultTestLoader.loadTestsFromTestCase(login_cqube_with_new_users.Creating_users),
                unittest.defaultTestLoader.loadTestsFromTestCase(Logs_scripts.Test_logs),
                unittest.defaultTestLoader.loadTestsFromTestCase(S3_files_script.Test_s3files),
                unittest.defaultTestLoader.loadTestsFromTestCase(Summary_Report.Test_summaryreport),
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