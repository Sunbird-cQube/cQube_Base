from HTMLTestRunner import HTMLTestRunner
import unittest


from Testscripts import  mouseover_clusters, mouseover_schools, click_blocks, click_regularuser, Regular_user, click_districts, click_on_hyperlink, Test_on_District, click_on_district, \
    test_District, District_operations


class MyTestSuite(unittest.TestCase):

    def test_Issue(self):
        smoke_test = unittest.TestSuite()
        smoke_test.addTests([
            #  file name .class name

            unittest.defaultTestLoader.loadTestsFromTestCase(mouseover_clusters.Cluster_Dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(mouseover_schools.Schools_Dots),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_blocks.Homebtn_click),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_regularuser.Regular_user),
            unittest.defaultTestLoader.loadTestsFromTestCase(Regular_user.Regular_userBack),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_districts.Choose2),
            unittest.defaultTestLoader.loadTestsFromTestCase(Test_on_District.Choose3),
            unittest.defaultTestLoader.loadTestsFromTestCase(click_on_district.Choose1),
            unittest.defaultTestLoader.loadTestsFromTestCase(test_District.Choose4),
            unittest.defaultTestLoader.loadTestsFromTestCase(District_operations.Choose5),


        ])

        outfile = open("/home/chetan/PycharmProjects/cQube/Report/Report2.html", "w")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='TestScript Execution Report',
            description='Smoke Tests'

        )

        runner1.run(smoke_test)

if __name__ == '__main__':
    unittest.main()