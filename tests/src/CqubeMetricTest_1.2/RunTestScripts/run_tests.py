from CompletionError import school_wise_completion_error
from DikshaColumnChart import all_days_course, all_days_overall, all_days_textbook, last_7_days_course, \
    last_7_days_overall, last_7_days_text_book, last_30_days_course, last_30_days_overall, last_30_days_text_book, \
    last_day_course, last_day_overall, last_day_text_book
from DikshaStackedChartBar import all_last_7_days, all_last_30_days, all_last_days, last_7_days, last_30_days, last_day
from DikshaTable import diksha_table_last_7_days_course, diksha_table_last_7_days_overall, \
    diksha_table_last_7_days_textbook, diksha_table_last_30_days_course, diksha_table_last_30_days_overall, \
    diksha_table_last_30_days_textbook, diksha_table_last_day_course, diksha_table_last_day_overall, \
    diksha_table_last_day_textbook
from SemesterExceptions import block_wise_percentage_schools_with_missing_data, block_wise_total_schools, \
    block_wise_total_schools_with_missing_data, cluster_wise_percentage_schools_with_missing_data, \
    cluster_wise_total_schools, cluster_wise_total_schools_with_missing_data, \
    district_wise_percentage_schools_with_missing_data, district_wise_total_schools, \
    district_wise_total_schools_with_missing_data, school_wise_total_schools_not_received
from get_dir import pwd
p = pwd()
import sys
sys.path.append(p.get_system_path())

import unittest
from HTMLTestRunner import HTMLTestRunner



class MyTestSuite(unittest.TestCase):

    def test_issue1(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(block_wise_percentage_schools_with_missing_data.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(block_wise_total_schools.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(block_wise_total_schools_with_missing_data.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_wise_percentage_schools_with_missing_data.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_wise_total_schools.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_wise_total_schools_with_missing_data.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(district_wise_percentage_schools_with_missing_data.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(district_wise_total_schools.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(district_wise_total_schools_with_missing_data.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(school_wise_total_schools_not_received.Semester),

        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title ='Semester Exception Metrics Test Report',
            verbosity = 1,

        )

        runner1.run(smoke_test)
        outfile.close()



    def test_issue2(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(all_last_7_days.DikshaStackedReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(all_last_30_days.DikshaStackedReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(all_last_days.DikshaStackedReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_7_days.DikshaStackedReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_30_days.DikshaStackedReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_day.DikshaStackedReport),

        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title ='Diksha Stacked Chart Metrics Test Report',
            verbosity = 1,

        )

        runner1.run(smoke_test)
        outfile.close()

    def test_issue3(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(all_days_course.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(all_days_overall.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(all_days_textbook.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_7_days_course.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_7_days_overall.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_7_days_text_book.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_30_days_course.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_30_days_overall.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_30_days_text_book.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_day_course.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_day_overall.DikshaColumnChartReport),
            unittest.defaultTestLoader.loadTestsFromTestCase(last_day_text_book.DikshaColumnChartReport)
        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Diksha Column Chart Metrics Test Report',
            verbosity=1,

        )

        runner1.run(smoke_test)
        outfile.close()

    def test_issue4(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_7_days_course.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_7_days_overall.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_7_days_textbook.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_30_days_course.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_30_days_overall.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_30_days_textbook.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_day_course.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_day_overall.DikshaTable),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha_table_last_day_textbook.DikshaTable)
        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Diksha Table Metrics Test Report',
            verbosity=1,

        )

        runner1.run(smoke_test)
        outfile.close()

    def test_issue5(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(school_wise_completion_error.CompletionErrorReport),

        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Completion Error Metrics Test Report',
            verbosity=1,

        )

        runner1.run(smoke_test)
        outfile.close()


if __name__ == '__main__':
    unittest.main()