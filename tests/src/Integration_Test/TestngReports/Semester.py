import time

from HTMLTestRunner import HTMLTestRunner
import unittest

from Semester_Report import Block_Btn_click, Block_Dots_validation, Block_test, Blocks_btn, Blocks_dots, \
    Cluster_btn_click, Count_records, Data_test, Data_validations, Dist18_Records, Dist_block_dots, \
    District_block_clicks, District_block_cluster, District_check, District_dataTest, District_dots, DistrictNames, \
    Dots_check, records_check, Login_Page, Random_dots, School_records_District, SR_Home, SR_HomeBtn
from Semester_Report.Clusterwise_validation import Block_cluster, click_on_District, clickon_Clusterbtn, Cluster_check, \
    Cluster_checks, Cluster_data_Check, Cluster_data_check, Cluster_dot, cluster_dot_clusternames, Cluster_dots_count, \
    Cluster_level_dots, Cluster_random, Cluster_record_check, Cluster_records, Cluster_to_Dashboard, Cluster_validation, \
    cluster_click_gohome, Clusterdata, Clusters_check, Clusters_test, clusterwise, click_on_Cluster_validation, \
    Dist_block_cluster, Dist_dotcount, District_clusters, District_clusterwise, Dots_check_names, home_icon, \
    Testing_records, Validate_district_cluster
from get_dir import pwd


class Dots_Validation_Block(object):
    pass


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        Integration_test = unittest.TestSuite()
        Integration_test.addTests([
             # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(Block_Btn_click.blockbtn_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Block_Dots_validation.District_count),
            unittest.defaultTestLoader.loadTestsFromTestCase(Block_test.District_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Blocks_btn.School_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Blocks_dots.count_dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_btn_click.blockbtn_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Count_records.District_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(Data_test.District_dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Data_validations.District_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist18_Records.dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_block_dots.Dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_block_clicks.Districts),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_block_cluster.District_Records),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_check.Semester_Home),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_dataTest.Semester_Home),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_dots.block_dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(DistrictNames.Semester_Dist_names),
            unittest.defaultTestLoader.loadTestsFromTestCase(records_check.click_on_District_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dots_check.validate_clicking_function),
            unittest.defaultTestLoader.loadTestsFromTestCase(Login_Page.Semester_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Random_dots.countdots_dist),
            unittest.defaultTestLoader.loadTestsFromTestCase(School_records_District.check_blkwise),
            unittest.defaultTestLoader.loadTestsFromTestCase(SR_Home.Semester_Home),
            unittest.defaultTestLoader.loadTestsFromTestCase(SR_HomeBtn.Dist_validation),
            #clusterwise
            unittest.defaultTestLoader.loadTestsFromTestCase(Block_cluster.Dist_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_District.District_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(clickon_Clusterbtn.clusterbtn_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_check.click_on_record),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_checks.test_onclick_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_data_Check.district_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_data_check.Distict_dots_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_dot.block_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_dot_clusternames.cluster_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_dots_count.dot_count_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_level_dots.test_dot_records),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_random.Radom_dots_match),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_record_check.Cluster_dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_records.check_datarecord_inleaflet),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_to_Dashboard.Dashobard_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_validation.test_on_clusterrecords),
            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_click_gohome.dots_test_gohome),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusterdata.district_record),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusters_check.click_on_block),
            unittest.defaultTestLoader.loadTestsFromTestCase(Clusters_test.Test_District_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(clusterwise.Test_blockwise_dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_Cluster_validation.click_on_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_block_cluster.District_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_dotcount.clickon_clusterecord),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_clusters.test_cluster),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_clusterwise.click_block_clusters),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dots_check_names.District_dots_check),
            unittest.defaultTestLoader.loadTestsFromTestCase(home_icon.Home_icon),
            unittest.defaultTestLoader.loadTestsFromTestCase(Testing_records.Cluster_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(Validate_district_cluster.District_dots_test)

        ])
        dir  =pwd()
        outfile = open("SR.html", "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Test Report',
            verbosity = 1,
            description='Integration Testing of Semester Assessment'

        )

        runner1.run(Integration_test)

if __name__ == '__main__':
    unittest.main()