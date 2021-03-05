from Admin_console import  create_user, change_password, user_list, Logs_scripts
from get_dir import pwd


import unittest
from HTMLTestRunner import HTMLTestRunner

class MyTestSuite(unittest.TestCase):

    def test_Issue01(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
        unittest.defaultTestLoader.loadTestsFromTestCase(create_user.create_user),

        ])
        p= pwd()
        outfile = open(p.get_functional_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Admin console Functional Test Report',
            verbosity=1,
            description="Admin Console Test Result "
        )

        runner1.run(functional_test)
        outfile.close()

    def test_Issue02(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(change_password.change_password),

        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Change password Functional Test Report',
            verbosity=1,
            description="Admin Console Test Result "
        )

        runner1.run(functional_test)
        outfile.close()

    def test_Issue03(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(user_list.user_list),

        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='User list Functional Test Report',
            verbosity=1,
            description="Admin Console Test Result "
        )

        runner1.run(functional_test)
        outfile.close()

    def test_Issue04(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(Logs_scripts.Test_logs)

        ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Logs Functional Test Report',
            verbosity=1,
            description="Admin Console Test Result "
        )

        runner1.run(functional_test)
        outfile.close()

if __name__ == '__main__':
    unittest.main()