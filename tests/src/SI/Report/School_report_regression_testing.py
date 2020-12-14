import unittest


from SI.Report.Click_on_xaxis_and_yaxis import Graph_values


from SI.Report.check_graph_present_on_school_infra import check_with_graph
from SI.Report.check_homebtn import home
from SI.Report.check_sc_scattor_blockwise_records import school_blockwise
from SI.Report.check_sc_scattor_clusterwise_records import Test_schoolwise
from SI.Report.check_sc_scattor_districtwise_records import test_districtwise

from SI.Report.check_tabledata_by_selecting_districts import districtwise_tabledata
from SI.Report.check_with_hyperlink import Hyperlink
from SI.Report.click_on_table_and_check_with_orderof_values import check_order_of_tabledata
from SI.Report.download_blockwise_csv import donwload_blockwise_csv
from SI.Report.download_clusterwise_csv import donwload_clusterwise_csv

from SI.Report.download_districtwise_csv import download_district_wise_csv
from SI.Report.download_schoolwise_csv import school_wise_donwload
from SI.Report.navigate_to_dashboard import check_dashboard
from SI.Report.navigate_to_schoolinfra_and_click_on_logout import schoolinfra_logout

from reuse_func import GetData


class cQube_SI_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    def test_dashboard(self):
        b = check_dashboard(self.driver)
        res = b.test_menulist()
        print("check with dashboard options is working fine ")
        self.data.page_loading(self.driver)

    def test_download_blockwise(self):
        b = donwload_blockwise_csv(self.driver)
        res = b.test_block()
        self.assertTrue(res, msg="File is not downloaded")
        b.remove_csv()
        print("blockwise csv file downloaded")
        self.data.page_loading(self.driver)

    def test_download_districtwise(self):
        b = download_district_wise_csv(self.driver)
        res = b.test_districtwise()
        self.assertTrue(res, msg="File is not downloaded")
        b.remove_file()
        print("districtwise csv file is downloaded")
        self.data.page_loading(self.driver)


    def test_download_clusterwise(self):
        b=donwload_clusterwise_csv(self.driver)
        res = b.test_clusterwise()
        self.assertTrue(res, msg="File is not downloaded")
        b.remove_csv()
        print("clusterwise csv file is downloaded")
        self.data.page_loading(self.driver)

    def test_download_schoolwise(self):
        b = school_wise_donwload(self.driver)
        res = b.test_schoolwise()
        self.assertTrue(res, msg="File is not downloaded")
        b.remove_csv()
        print("schoolwise csv file is downloaded")
        self.data.page_loading(self.driver)

    def test_check_hyperlinks(self):
        hyperlinks = Hyperlink(self.driver)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District ":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")
        self.data.page_loading(self.driver)


    def test_home(self):
        b = home(self.driver)
        res = b.test_homeicon()
        print("homeicon is working..")
        self.data.page_loading(self.driver)

    def test_homebutton(self):
        b = home(self.driver)
        res = b.test_homebtn()
        print("homeicon is working..")
        self.assertEqual(res,0,msg='Home button is not working ')
        self.data.page_loading(self.driver)

    def test_check_orderwise(self):
        b = check_order_of_tabledata(self.driver)
        print("Table record order wise..")
        res = b.test_tablevalue()
        print("checked with orderwise of table data")
        self.data.page_loading(self.driver)

    def test_schools_per_cluster_csv_download1(self):
        school = Test_schoolwise(self.driver)
        result = school.check_csv_download1()
        if result == 0:
            print("Schools per cluster csv download report is working")
            print("on selection of each district,block and cluster")
            print("The footer value of no of schools and no of students are")
            print("equals to downloaded file")
        else:
            raise self.failureException("Schools per cluster csv report download1 is working")

    def test_tabledata_districtwise(self):
        b = districtwise_tabledata(self.driver)
        res = b.test_table_data()
        if res != 0:
            raise self.failureException('Data not found on table')
        print("Districtwise table data is present...")
        self.data.page_loading(self.driver)


    def test_logout(self):
        b = schoolinfra_logout(self.driver)
        res = b.test_logout()
        self.assertNotIn(" School Infrastructure report for: ", self.driver.page_source,
                         msg="School infrastructure report not exist ")
        self.assertEqual("Log in to cQube", self.driver.title, msg="logout is not working ")
        print("logout functionality is working...")
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    def test_plotxvalues(self):
        b = Graph_values(self.driver)
        res = b.test_xplots()
        print("Checked with xaxis values are working..")
        self.data.page_loading(self.driver)

    def test_plotyvalues(self):
        b = Graph_values(self.driver)
        res = b.test_yaxis()
        print("Checked with  y axis values are working..")
        self.data.page_loading(self.driver)


    def test_sc_scator_districtwise(self):
            b = test_districtwise(self.driver)
            result = b.test_districtwise()
            self.assertEqual(0,result,msg="No data found")
            print("Checked with each district wise records")
            self.data.page_loading(self.driver)


    def test_sc_scator_blockwise(self):
            b = school_blockwise(self.driver)
            result = b.test_blockwise()
            self.assertEqual(0,result,msg="No data found")
            print("Checked with each block wise records")
            self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
