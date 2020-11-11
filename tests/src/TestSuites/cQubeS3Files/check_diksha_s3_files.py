import unittest

from HTMLTestRunner import HTMLTestRunner

from get_dir import pwd
from s3 import diksha_barchart, diksha_stackbar, diksha_table_report, diksha_tpd


class MyTestSuite(unittest.TestCase):
    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_barchart.DikshaBarChart),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_stackbar.DikshaStackBar),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_report.DikshaTableReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_tpd.DikshaTpd)

        ])
        p = pwd()
        outfile = open(p.get_s3_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Diksha S3 Files Check Report',
            verbosity=1,
        )

        runner1.run(functional_test)
        outfile.close()
if __name__ == '__main__':
    unittest.main()