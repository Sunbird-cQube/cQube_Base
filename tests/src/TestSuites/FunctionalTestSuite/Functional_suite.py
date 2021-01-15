import unittest

from HTMLTestRunner import HTMLTestRunner

from Health_Card_Index import health_card_regression_test, Health_card_functional_Test
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_issue01(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(Health_card_functional_Test.Health_card_functionalTest),
            ])
        p = pwd()
        outfile = open(p.get_functional_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Health card functional Test Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()


if __name__ == '__main__':
    unittest.main()
