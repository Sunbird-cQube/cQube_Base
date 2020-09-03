
from Landing_Page import cQube_home_page
from get_dir import pwd
import unittest
from HTMLTestRunner import HTMLTestRunner



class MyTestSuite(unittest.TestCase):

    @classmethod

    def test_Issue(self):

            functional_test = unittest.TestSuite()
            functional_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(cQube_home_page.cQube_Home),
            ])
            p= pwd()
            outfile = open(p.get_functional_report_path(), "w")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Landing Test Report',
                verbosity=1,
            )



            runner1.run(functional_test)
            outfile.close()


    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()

