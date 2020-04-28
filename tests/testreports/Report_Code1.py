from HTMLTestRunner import HTMLTestRunner
import unittest

from Testscripts import login_page, click_block, click_clusters, click_schools, click_on_District, District_options, click_Dashboard, click_download, Dots_mouseover, \
    Mouse_over_homepage, mouseover_clusters, mouseover_schools, click_blocks, click_regularuser, Regular_user, click_districts, click_on_hyperlink, Test_on_District, click_on_district, \
    test_District, District_operations, mouseover_District, mouseover_on_District, mouse_over, mouseover_dots, District_test, District_tests, Dist_options, District_details, \
    mouse_hover_on_dots, block_mouse_hover, District2, Random_district, District_18_click, Dist_mousehover, Data_test, click_on_crcreports, log_in_out, Error_msg


class MyTestSuite1(unittest.TestCase):

    def test_Issue(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([

            unittest.defaultTestLoader.loadTestsFromTestCase(block_mouse_hover.Choose15),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_block.Blocks),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_clusters.Clusters),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_schools.Schools),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_District.District),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_options.District),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_Dashboard.District),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_download.Report_download),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dots_mouseover.Home_Dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(Mouse_over_homepage.Block_Dots),

        ])

        outfile = open("/home/chetan/PycharmProjects/cQube/Report/Report1.html", "w")
        runner = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Test Report',
            description='Test script Execution Report'

        )
        runner.run(smoke_test)

if __name__ == '__main__':
    unittest.main()