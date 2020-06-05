from get_dir import pwd
p = pwd()
import sys
sys.path.append(p.get_system_path())
import sys
import os
import unittest
from HTMLTestRunner import HTMLTestRunner

from TS import district_student_check_8,district_student_check_9,district_student_check_10,\
    district_attendance_check_8,district_attendance_check_9,district_attendance_check_10,\
    block_attendance_check_8,block_attendance_check_9,block_attendance_check_10,block_student_check_8,block_student_check_9,\
    block_student_check_10,cluster_student_check_8,cluster_student_check_9,cluster_student_check_10,\
    cluster_attendance_check_8,cluster_attendance_check_9,cluster_attendance_check_10,\
    school_student_check_8,school_student_check_9,school_student_check_10,\
    school_attendance_check_8,school_attendance_check_9,school_attendance_check_10

from CRC import District_wise_no_of_schools_per_crc,District_wise_visited_schools_count_and_total_visits,District_wise_visits_percentage,\
    Blockwise_crc_schools,Blockwise_Total_Visited,Blockwise_visits_and_percentage,\
    Clusterwise_crc_schools,Clusterwise_total_visited,Clusterwise_visits_and_percentage,\
    Schoolwise_crc_schools,Schoolwise_Visited_school,Schoolwise_Percentage

from Semester import district_wise_student_counts_and_total_schools,district_wise_grade_percentage,district_wise_school_percentage_and_value,\
    block_wise_student_counts_and_total_schools,block_wise_grade_percentage,block_wise_school_percentage_and_value,\
    cluster_wise_student_counts_and_total_schools,cluster_wise_grade_percentage,cluster_wise_school_percentage_and_value,\
    school_wise_student_counts,school_wise_grade_percentage


class MyTestSuite(unittest.TestCase):

    # def test_issue1(self):
    #     smoke_test = unittest.TestSuite()
    #     smoke_test.addTests([
    #         # file name .class name
    #         unittest.defaultTestLoader.loadTestsFromTestCase(district_student_check_8.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(district_attendance_check_8.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(district_student_check_9.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(district_attendance_check_9.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(district_student_check_10.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(district_attendance_check_10.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(block_student_check_8.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(block_attendance_check_8.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(block_student_check_9.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(block_attendance_check_9.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(block_student_check_10.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(block_attendance_check_10.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(cluster_student_check_8.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(cluster_attendance_check_8.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(cluster_student_check_9.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(cluster_attendance_check_9.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(cluster_student_check_10.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(cluster_attendance_check_10.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(school_student_check_8.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(school_attendance_check_8.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(school_student_check_9.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(school_attendance_check_9.SAR),
    #
    #         unittest.defaultTestLoader.loadTestsFromTestCase(school_student_check_10.SAR),
    #         unittest.defaultTestLoader.loadTestsFromTestCase(school_attendance_check_10.SAR)
    #
    #
    #     ])
    #     p = pwd()
    #     outfile = open(p.get_report_path(), "w")
    #
    #     runner1 = HTMLTestRunner.HTMLTestRunner(
    #         stream = outfile,
    #         title ='Cqube Metrics Test Report',
    #         verbosity = 1,
    #         description= '8 = August, 9 = September, 10 = October '
    #
    #     )
    #
    #     runner1.run(smoke_test)
    #     outfile.close()

    def test_issue2(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(District_wise_no_of_schools_per_crc.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_wise_visited_schools_count_and_total_visits.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_wise_visits_percentage.Crc),

            unittest.defaultTestLoader.loadTestsFromTestCase(Blockwise_crc_schools.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(Blockwise_Total_Visited.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(Blockwise_visits_and_percentage.Crc),

            unittest.defaultTestLoader.loadTestsFromTestCase(Clusterwise_crc_schools.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusterwise_total_visited.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusterwise_visits_and_percentage.Crc),

            unittest.defaultTestLoader.loadTestsFromTestCase(Schoolwise_crc_schools.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(Schoolwise_Visited_school.Crc),
            unittest.defaultTestLoader.loadTestsFromTestCase(Schoolwise_Percentage.Crc)
        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title ='CRC Metrics Test Report',
            verbosity = 1,

        )

        runner1.run(smoke_test)
        outfile.close()



    def test_issue3(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(district_wise_student_counts_and_total_schools.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(district_wise_grade_percentage.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(district_wise_school_percentage_and_value.Semester),

            unittest.defaultTestLoader.loadTestsFromTestCase(block_wise_student_counts_and_total_schools.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(block_wise_grade_percentage.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(block_wise_school_percentage_and_value.Semester),

            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_wise_student_counts_and_total_schools.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_wise_grade_percentage.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_wise_school_percentage_and_value.Semester),

            unittest.defaultTestLoader.loadTestsFromTestCase(school_wise_student_counts.Semester),
            unittest.defaultTestLoader.loadTestsFromTestCase(school_wise_grade_percentage.Semester),
        ])
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title ='Semester Metrics Test Report',
            verbosity = 1,

        )

        runner1.run(smoke_test)
        outfile.close()


if __name__ == '__main__':
    unittest.main()