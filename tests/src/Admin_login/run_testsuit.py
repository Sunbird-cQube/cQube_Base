

from Admin_login import check_admin_landing_page, All_user_scripts, check_admin_login, check_login_to_cqube, \
    create_user, Logs_scripts, S3_files_script
from get_dir import pwd


import unittest
from HTMLTestRunner import HTMLTestRunner

class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
                unittest.defaultTestLoader.loadTestsFromTestCase(check_admin_landing_page.Test_admin_landing_page),
                unittest.defaultTestLoader.loadTestsFromTestCase(All_user_scripts.Test_allusers),
                unittest.defaultTestLoader.loadTestsFromTestCase(check_admin_login.Test_admin_login),
                unittest.defaultTestLoader.loadTestsFromTestCase(check_login_to_cqube.Test_login_to_cqube),
                unittest.defaultTestLoader.loadTestsFromTestCase(create_user.Test_admin_login),
                unittest.defaultTestLoader.loadTestsFromTestCase(Logs_scripts.Test_logs),
                unittest.defaultTestLoader.loadTestsFromTestCase(S3_files_script.Test_s3files),

        ])
        p= pwd()
        outfile = open(p.get_admin_login_path(), "w")
        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Functional Test Report',
            verbosity=1,
            description="Admin login Test Result "
        )

        runner1.run(functional_test)
        outfile.close()


if __name__ == '__main__':
    unittest.main()