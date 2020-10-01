import unittest

from HTMLTestRunner import HTMLTestRunner

from get_dir import pwd
from s3 import log_summary

class MyTestSuite(unittest.TestCase):
    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(log_summary.LogSummary)

        ])
        p = pwd()
        outfile = open(p.get_s3_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Log Summary S3 Files Check Report',
            verbosity=1,
        )

        runner1.run(functional_test)
        outfile.close()

if __name__ == '__main__':
    unittest.main()