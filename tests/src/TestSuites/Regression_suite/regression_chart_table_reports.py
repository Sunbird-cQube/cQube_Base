


from CRC import  crc_report_regression_testing
from Composite_report import composite_regression_testing
from Health_Card_Index import health_card_regression_test
from Periodic_Test_Reports.Pat_Heatchart import patheatchart_regression_test

from SI.Report import  School_report_regression_testing
from Telemetry import telemetry_regression_testing
from Periodic_Test_Reports.pat_LO_Table import PAT_LO_Table_regression_suite

from get_dir import pwd

import unittest
from HTMLTestRunner import HTMLTestRunner

from reuse_func import GetData


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)




    def test_issue01(self):

                regression_test = unittest.TestSuite()
                regression_test.addTests([
                    # file name .class name
                    unittest.defaultTestLoader.loadTestsFromTestCase(crc_report_regression_testing.cQube_CRC_Report),
                ])
                p = pwd()
                outfile = open(p.get_regression_chart_table_reports(), "a")

                runner1 = HTMLTestRunner.HTMLTestRunner(
                    stream=outfile,
                    title='Crc regression Test Report',
                    verbosity=1,

                )

                runner1.run(regression_test)
                outfile.close()

    


    def test_issue02(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(School_report_regression_testing.cQube_SI_Report)
            ])
            p = pwd()
            outfile = open(p.get_regression_chart_table_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='School Infra regression Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

    # def test_issue03(self):
    # 
    #         regression_test = unittest.TestSuite()
    #         regression_test.addTests([
    #             unittest.defaultTestLoader.loadTestsFromTestCase(diksha_chart_Regression_testing.cQube_diskha_chart)
    #         ])
    #         p = pwd()
    #         outfile = open(p.get_regression_chart_table_reports(), "a")
    # 
    #         runner1 = HTMLTestRunner.HTMLTestRunner(
    #             stream=outfile,
    #             title='Diksha usage by profile chart regression Test Report',
    #             verbosity=1,
    # 
    #         )
    # 
    #         runner1.run(regression_test)
    #         outfile.close()



    def test_issue04(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(telemetry_regression_testing.Test_Telemetry)
            ])
            p = pwd()
            outfile = open(p.get_regression_chart_table_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Telemetry Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()


    def test_issue05(self):

            regression_test = unittest.TestSuite()
            regression_test.addTests([
                unittest.defaultTestLoader.loadTestsFromTestCase(composite_regression_testing.composite_regression_report)
            ])
            p = pwd()
            outfile = open(p.get_regression_chart_table_reports(), "a")

            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfile,
                title='Composite Report Regression Test Report',
                verbosity=1,

            )

            runner1.run(regression_test)
            outfile.close()

  

    def test_issue06(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                patheatchart_regression_test.cQube_heatchart_regression_test
            )
        ])
        p = pwd()
        outfile = open(p.get_regression_chart_table_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title=' PAT Heat chart Report Regression Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

    def test_issue07(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                PAT_LO_Table_regression_suite.cQube_pat_lotable_regression_test
            )
        ])
        p = pwd()
        outfile = open(p.get_regression_chart_table_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title=' PAT LO Table Report Regression Test Report',
            verbosity=1,

        )
        runner1.run(regression_test)
        outfile.close()

   
    def test_issue08(self):
        regression_test = unittest.TestSuite()
        regression_test.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(
                health_card_regression_test.Health_card_regression_test
            )
        ])
        p = pwd()
        outfile = open(p.get_regression_chart_table_reports(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Health card Regression Test Report',
            verbosity=1,
        )
        runner1.run(regression_test)
        outfile.close()

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == '__main__':
    unittest.main()

