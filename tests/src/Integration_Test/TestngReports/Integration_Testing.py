from HTMLTestRunner import HTMLTestRunner
import unittest

from Integration_Test.Test_scripts import blockdata_check, blocks_csv_download, Check_district_block, \
    click_on_cqube_login, click_logout, click_on_usercreate, user_data_create, click_on_homeButton, cluster_data_check, \
    clusters_csv_download, Home_map, Click_on_school_csv_download, Click_on_block_cluster_schools, click_on_blocks, \
    click_on_cluster, click_on_district, click_on_schools, Click_on_SR_HomeBtn, Cluster_level_dots, \
    Cluster_to_Dashboard, Dashboard_menu, District_clusters, Click_on_Semester
from TS import Blocks_random

from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        Integration_test = unittest.TestSuite()
        Integration_test.addTests([


            unittest.defaultTestLoader.loadTestsFromTestCase(Click_on_block_cluster_schools.SAROption),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_blocks.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_cluster.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_district.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_schools.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(Click_on_SR_HomeBtn.Home_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_level_dots.test_dot_records),
            unittest.defaultTestLoader.loadTestsFromTestCase(Cluster_to_Dashboard.Dashobard_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dashboard_menu.Dash_menu),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_clusters.test_cluster),

            unittest.defaultTestLoader.loadTestsFromTestCase(blockdata_check.Blockdata_validation),
            unittest.defaultTestLoader.loadTestsFromTestCase(blocks_csv_download.Block_validation),
            unittest.defaultTestLoader.loadTestsFromTestCase(Blocks_random.District_validation),
            unittest.defaultTestLoader.loadTestsFromTestCase(Check_district_block.block_validation),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_cqube_login.CqubeLogin),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_logout.SAR),
            unittest.defaultTestLoader.loadTestsFromTestCase(Click_on_Semester.test_SR),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_usercreate.Click_create),
            unittest.defaultTestLoader.loadTestsFromTestCase(user_data_create.user_data),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_homeButton.SAR),

            unittest.defaultTestLoader.loadTestsFromTestCase(cluster_data_check.dist_test),
            unittest.defaultTestLoader.loadTestsFromTestCase(clusters_csv_download.Block_validation),
            unittest.defaultTestLoader.loadTestsFromTestCase(Home_map.Sel_type),
            unittest.defaultTestLoader.loadTestsFromTestCase(Click_on_school_csv_download.Block_validation),




        ])
        p = pwd()
        outfile = open(p.get_integration_report_path(), "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Test Report',
            verbosity=1,
            description='Integration Test Result '

        )

        runner1.run(Integration_test)

if __name__ == '__main__':
    unittest.main()