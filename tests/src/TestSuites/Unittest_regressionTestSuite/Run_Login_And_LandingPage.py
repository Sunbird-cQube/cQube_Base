from Landing_Page import cQube_home_page
from get_dir import pwd
from Login import login_regression_testing
import unittest
from HTMLTestRunner import HTMLTestRunner
from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        self.data = GetData()
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(login_regression_testing.cQube_Login_Test),
            unittest.defaultTestLoader.loadTestsFromTestCase(cQube_home_page.cQube_Home)

        ])
        p = pwd()
        outfile = open(p.get_regression_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Login Regression Test Report',
            verbosity=1,

        )

        runner1.run(regression_test)
        outfile.close()

if __name__ == '__main__':
    unittest.main()