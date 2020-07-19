import sys
import os
import unittest
from HTMLTestRunner import HTMLTestRunner
from Data.parameters import Data
from TS import click_on_cqube_login, click_on_blocks, check_cluster_wise_report, check_district_wise_map, \
    click_on_cluster, click_on_homeButton, click_on_logout, click_on_schools
from TS.click_on_cqube_login import CqubeLogin
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        Integration_test = unittest.TestSuite()
        Integration_test.addTests([
            # file name .class name
            # unittest.defaultTestLoader.loadTestsFromTestCase(click_on_cqube_login.CqubeLogin),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_blocks.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_cluster_wise_report.SemesterReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_district_wise_map.SAR),
            # unittest.defaultTestLoader.loadTestsFromTestCase(Click_on_SAR.SAR_2),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_blocks.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_cluster.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_homeButton.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_logout.CqubeLogin),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_schools.SAR)

        ])
        report = pwd()
        outfile = open(report.get_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title = 'Test Report',
            verbosity = 1,
            description = 'Integration Tests'

        )

        runner1.run(Integration_test)
        outfile.close()


if __name__ == '__main__':
    unittest.main()
