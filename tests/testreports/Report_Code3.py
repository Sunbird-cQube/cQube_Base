from HTMLTestRunner import HTMLTestRunner
import unittest

from Testscripts import  mouseover_District, mouseover_on_District, mouse_over, mouseover_dots, District_test, District_tests, Dist_options, District_details, \
    mouse_hover_on_dots, block_mouse_hover


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            #  file name .class name

            unittest.defaultTestLoader.loadTestsFromTestCase(mouseover_District.Choose6),
            unittest.defaultTestLoader.loadTestsFromTestCase(mouseover_on_District.Choose7),
            unittest.defaultTestLoader.loadTestsFromTestCase(mouse_over.Choose8),
            unittest.defaultTestLoader.loadTestsFromTestCase(mouseover_dots.Choose9),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_test.Choose10),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_tests.Choose11),
            unittest.defaultTestLoader.loadTestsFromTestCase(Dist_options.Choose12),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_details.Choose13),
            unittest.defaultTestLoader.loadTestsFromTestCase(mouse_hover_on_dots.Choose14),
            unittest.defaultTestLoader.loadTestsFromTestCase(block_mouse_hover.Choose15),


        ])

        outfile = open("/home/chetan/PycharmProjects/cQube/Report/Report3.html", "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='TestScript Execution Report',
            description='Smoke Tests'

        )

        runner1.run(smoke_test)

if __name__ == '__main__':
    unittest.main()