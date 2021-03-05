


import unittest
from HTMLTestRunner import HTMLTestRunner

from Admin_console.summary_statistics import test_crc_summary, test_diksha_data_summary, test_dikshatpd_file_summary, \
    test_infra_summary, test_inspection_summary, test_pat_file_summary, test_semester_summary, \
    test_static_block_file_summary, test_static_cluster_file_summary, test_static_districtfile_summary, \
    test_static_school_file_summary, test_student_summary, test_udise_summary
from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue01(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
        unittest.defaultTestLoader.loadTestsFromTestCase(test_crc_summary.Test_crc_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_diksha_data_summary.Test_diksha_data_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_dikshatpd_file_summary.Test_diksha_tpd_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_infra_summary.Test_infra_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_inspection_summary.Test_inspection_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_pat_file_summary.Test_pat_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_semester_summary.Test_semester_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_static_block_file_summary.Test_static_block_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_static_cluster_file_summary.Test_static_cluster_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_static_districtfile_summary.Test_static_district_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_static_school_file_summary.Test_static_school_summary),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_student_summary.Test_summaryreport),
        unittest.defaultTestLoader.loadTestsFromTestCase(test_udise_summary.Test_udise_file_summary),

        ])
        p= pwd()
        outfile = open(p.get_functional_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Summary Functional Test Report',
            verbosity=1,
            description="Admin Console Test Result "
        )

        runner1.run(functional_test)
        outfile.close()