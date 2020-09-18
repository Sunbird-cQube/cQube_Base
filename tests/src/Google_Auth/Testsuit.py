from HTMLTestRunner import HTMLTestRunner
import unittest

from Google_Auth import check_with_one_time_code_page, check_with_random_otp, check_with_restart_login_icon, \
    check_with_username_in_otp_page, login_to_cqube_with_otp, login_without_entering_opt, login_with_old_otp
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(login_with_old_otp.Negative_testing),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_with_one_time_code_page.cQube_Authentication),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_with_random_otp.Negative_testing),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_with_restart_login_icon.Googleauth_testing),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_with_username_in_otp_page.Googleauth_testing),
            unittest.defaultTestLoader.loadTestsFromTestCase(login_to_cqube_with_otp.cQube_Authentication),
            unittest.defaultTestLoader.loadTestsFromTestCase(login_without_entering_opt.Googleauth_testing),
        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Test Report',
            verbosity=1,
            description='Functional Test Result '

        )

        runner1.run(functional_test)


if __name__ == '__main__':
    unittest.main()