from HTMLTestRunner import HTMLTestRunner
import unittest

from Testscripts import District2, Random_district, District_18_click, Dist_mousehover, Data_test, click_on_crcreports, log_in_out, Error_msg, \
    click_on_hyperlink, dots_hover


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(District2.Choose16),
            unittest.defaultTestLoader.loadTestsFromTestCase(Random_district.Choose17),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_18_click.Choose18),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_mousehover.Choose19),
            unittest.defaultTestLoader.loadTestsFromTestCase(Data_test.Choose20),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_crcreports.CRC),
            unittest.defaultTestLoader.loadTestsFromTestCase(Error_msg.Logerror),
            unittest.defaultTestLoader.loadTestsFromTestCase(log_in_out.Log_Out),
            unittest.defaultTestLoader.loadTestsFromTestCase(dots_hover.Dist_5),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_hyperlink.Hyper_link),

        ])

        outfile = open("/home/chetan/PycharmProjects/cQube/Report/Report4.html", "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Testscript Execution Report',
            description='Smoke Tests'

        )

        runner1.run(smoke_test)

if __name__ == '__main__':
    unittest.main()