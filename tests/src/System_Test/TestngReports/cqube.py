import sys
import os
import unittest
from HTMLTestRunner import HTMLTestRunner
from Data.parameters import Data
from TS import click_on_cqube_login, click_on_blocks, \
    click_on_cluster, click_on_homeButton, click_on_schools
from TS.click_on_cqube_login import CqubeLogin
from CRC_Report import cluster_table_record, Cluster_wise_file, \
    Clusterwise_test, CRC_Blockwise, crc_cluster, CRC_distlist, \
    CRC_District, CRC_District_Details, CRC_download, CRCreports, \
    dist_blk_clu, Dist_block, District_click_all, District_wise_file, \
    Districtwise_file, Districtwise_validation, Footer_data, Graph_xaxis_dropdown, \
    Graph_XY, Graph_Yaxis, map_cluster, Map_validation1, map_validation2, \
    Select_District_validate, Select_Type, Selecttype_files, TableData_District

from Semester_Report.Clusterwise_validation import Block_cluster, click_on_Cluster_validation, \
    click_on_District,clickon_Clusterbtn, clickon_Clusterbtn, Cluster_check, Cluster_checks, \
    cluster_click_gohome, cluster_click_gohome, Cluster_data_Check, Cluster_data_check, \
    Cluster_dot, Cluster_dots_count, Cluster_level_dots, Cluster_random, Cluster_record_check, \
    Cluster_to_Dashboard, Cluster_validation, Clusterdata, Clusters_check, Clusters_test, \
    clusterwise, Dist_block_cluster, Dist_dotcount, District_clusters, District_clusterwise, \
    Dots_check_names, home_icon, Testing_records, Validate_district_cluster

from Semester_Report import District_dataTest,District_dots,DistrictNames,Dots_check, \
    Login_Page, Random_dots, records_check, School_records_District,SEM, SR_Home, \
    SR_HomeBtn


from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue_sar(self,month):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            #Student Attendance Report
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_cqube_login.CqubeLogin),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_blocks.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_cluster.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_schools.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_homeButton.SAR)
        ])
        # html_report_generate_path = Data()
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title =  month+ 'SAR Test Report',
            verbosity = 1,
            description = 'Smoke Tests'

        )

        runner1.run(smoke_test)
        outfile.close()



    def test_Issue_crc(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            ##CRC Reports
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_table_record.test_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusterwise_test.table_recordtest),
            unittest.defaultTestLoader.loadTestsFromTestCase(CRC_Blockwise.crc_cluster_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(CRC_distlist.District_list),
            unittest.defaultTestLoader.loadTestsFromTestCase(CRC_District_Details.crc_report),
            unittest.defaultTestLoader.loadTestsFromTestCase(CRC_download.Crc_Reports),
            unittest.defaultTestLoader.loadTestsFromTestCase(CRCreports.Crc_Reports),
            unittest.defaultTestLoader.loadTestsFromTestCase(dist_blk_clu.District_recordtest),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_block.Crc_Reports),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_click_all.Crc_Reports),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_wise_file.Crc_Reports),
            unittest.defaultTestLoader.loadTestsFromTestCase(Districtwise_file.Crc_Reports),
            unittest.defaultTestLoader.loadTestsFromTestCase(Districtwise_validation.dwise_type),
            unittest.defaultTestLoader.loadTestsFromTestCase(Footer_data.bar_details),
            unittest.defaultTestLoader.loadTestsFromTestCase(Graph_xaxis_dropdown.Xaxis),
            unittest.defaultTestLoader.loadTestsFromTestCase(Graph_XY.XYaxis),
            unittest.defaultTestLoader.loadTestsFromTestCase(Graph_Yaxis.Yaxis),
            unittest.defaultTestLoader.loadTestsFromTestCase(map_cluster.Map_blocks),
            unittest.defaultTestLoader.loadTestsFromTestCase(Map_validation1.Map_District),
            unittest.defaultTestLoader.loadTestsFromTestCase(map_validation2.Map_blocks),
            unittest.defaultTestLoader.loadTestsFromTestCase(Select_District_validate.District_report),
            unittest.defaultTestLoader.loadTestsFromTestCase(Select_Type.Sel_type),
            unittest.defaultTestLoader.loadTestsFromTestCase(TableData_District.Crc_Reports)
        ])
        # html_report_generate_path = Data()
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title =  'CRC Test Report',
            verbosity = 1,
            description = 'Smoke Tests'

        )

        runner1.run(smoke_test)
        outfile.close()


    def test_Issue_sem(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            # file name .class name
            ##Semester Reports
            unittest.defaultTestLoader.loadTestsFromTestCase(Block_cluster.Dist_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_Cluster_validation.click_on_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_District.District_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(clickon_Clusterbtn.clusterbtn_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_check.click_on_record),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusters_check.click_on_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_click_gohome.dots_test_gohome),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_data_Check.district_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_data_check.Distict_dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_dot.block_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_dots_count.dot_count_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_level_dots.test_dot_records),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_record_check.Cluster_dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_to_Dashboard.Dashobard_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_validation.test_on_clusterrecords),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusterdata.district_record),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusters_check.click_on_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusters_test.Test_District_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(clusterwise.Test_blockwise_dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_block_cluster.District_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_dotcount.clickon_clusterecord),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_clusterwise.click_block_clusters),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dots_check_names.District_dots_check),
            unittest.defaultTestLoader.loadTestsFromTestCase(home_icon.Home_icon),
            unittest.defaultTestLoader.loadTestsFromTestCase(Testing_records.Cluster_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Validate_district_cluster.District_dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_dataTest.Semester_Home),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_dots.block_dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(DistrictNames.Semester_Dist_names),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dots_check.validate_clicking_function),
            unittest.defaultTestLoader.loadTestsFromTestCase(Login_Page.Semester_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Random_dots.countdots_dist),
            unittest.defaultTestLoader.loadTestsFromTestCase(records_check.click_on_District_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(SR_Home.Semester_Home),
            unittest.defaultTestLoader.loadTestsFromTestCase(SR_HomeBtn.Dist_validation)
        ])
        # html_report_generate_path = Data()
        p = pwd()
        outfile = open(p.get_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream = outfile,
            title =  'SEM Test Report',
            verbosity = 1,
            description = 'Smoke Tests'

        )

        runner1.run(smoke_test)
        outfile.close()

if __name__ == '__main__':
    unittest.main()
