import time

from HTMLTestRunner import HTMLTestRunner
import unittest

from Sanity_test.CRC import cluster_table_record, Clusterwise_test, CRC_Blockwise, CRC_distlist, \
    CRC_District_Details, CRC_download, CRCreports, dist_blk_clu, Dist_block, District_click_all, District_wise_file, \
    Districtwise_file, Districtwise_validation, Footer_data, Graph_xaxis_dropdown, Graph_XY, Graph_Yaxis, map_cluster, \
    Map_validation1, map_validation2, Select_District_validate, Select_Type, TableData_District




from get_dir import pwd


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        Functional_test = unittest.TestSuite()
        Functional_test.addTests([


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
            unittest.defaultTestLoader.loadTestsFromTestCase(TableData_District.Crc_Reports),






        ])
        # dir  =pwd()
        outfile = open("crc.html", "w")
        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Test Report',
            verbosity = 1,
            description='Functional Testing Report'

        )

        runner1.run(Functional_test)

if __name__ == '__main__':
    unittest.main()
