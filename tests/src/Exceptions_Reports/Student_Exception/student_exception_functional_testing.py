import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from Exceptions_Reports.Student_Exception.student_attendance_exception_scripts import Student_Exceptions
from reuse_func import GetData


class cQube_Student_Attendance_exception(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_student_exception()
        year = Select(self.driver.find_element_by_id(Data.sar_year))
        month = Select(self.driver.find_element_by_id(Data.sar_month))
        self.year = year.first_selected_option.text
        self.month = month.first_selected_option.text

    def test_click_on_student_exception(self):
        count = 0
        p =  Student_Exceptions(self.driver,self.year, self.month)
        res = p.click_on_sar_exception()
        if 'student-attendance-exception' in res:
            print('Student attendance exception is present')
        else:
             print('Student exception report is not displayed ')
             count = count + 1
        self.assertEqual(0,count,msg='Navigation to report is failed')
        self.data.page_loading(self.driver)

    def test_dashboard_student_exception(self):
        p =  Student_Exceptions(self.driver,self.year, self.month)
        res = p.dashboard_sar_exception()
        self.assertEqual(0,res,msg='Dashboard to report is failed')
        self.data.page_loading(self.driver)

    def test_click_on_block_and_clusterbtns(self):
        p =  Student_Exceptions(self.driver,self.year, self.month)
        res = p.check_markers_on_block_map()
        self.assertEqual(0,res,msg='Footer value mis match found')
        self.data.page_loading(self.driver)

        res = p.check_markers_on_clusters_map()
        self.assertEqual(0, res, msg='Footer value mis match found')
        self.data.page_loading(self.driver)

    def test_click_on_school_btn(self):
        p = Student_Exceptions(self.driver, self.year, self.month)
        res = p.check_markers_on_schools_map()
        self.assertEqual(0, res, msg='Footer value mis match found')
        self.data.page_loading(self.driver)


    def test_month_and_year(self):
        p =  Student_Exceptions(self.driver,self.year, self.month)
        res = p.check_year_and_month_dropdowns_csv_download()
        self.assertEqual(0, res, msg='year and month csv file is not downloaded')
        print('checked with Time series year and month')
        self.data.page_loading(self.driver)

    def test_logout(self):
        logout = Student_Exceptions(self.driver,self.year, self.month)
        result = logout.click_on_logout()
        self.assertEqual("Log in to cQube", result, msg="login page is not exist!..")
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_student_exception()
        self.data.page_loading(self.driver)

    def test_check_hyperlinks(self):
        hyperlinks = Student_Exceptions(self.driver,self.year, self.month)
        result1, result2, choose_dist = hyperlinks.click_on_hyperlinks()
        if result1 == False and result2 == False and choose_dist == "Choose a District ":
            print("hyperlinks are working")
        else:
            raise self.failureException("hyperlinks are not working")

    def test_districtwise_csv_download(self):
        csv = Student_Exceptions(self.driver,self.year, self.month)
        result = csv.click_download_icon_of_district()
        if result:
            print("District wise csv report download is working")
        else:
            raise self.failureException("District wise csv report download is not working")


    def test_no_of_schools_is_equals_at_districts_blocks_clusters_schools(self):
        tc = Student_Exceptions(self.driver,self.year, self.month)
        schools, Bschools = tc.block_no_of_schools()
        self.assertEqual(int(schools), int(Bschools), msg="Block level no of schools are not equal to no of schools ")
        schools, Cschools = tc.cluster_no_of_schools()
        self.assertEqual(int(schools), int(Cschools), msg="Cluster level no of schools are not equal to no of schools ")
        schools, Sschools = tc.schools_no_of_schools()
        self.assertEqual(int(schools), int(Sschools), msg="Cluster level no of schools are not equal to no of schools ")

    def test_total_no_of_students_is_equals_at_districts_blocks_clusters_schools(self):
        tc = Student_Exceptions(self.driver,self.year, self.month)
        student_count, Bstudents = tc.block_total_no_of_students()
        self.assertEqual(int(student_count), int(Bstudents), msg="Block level no of students are not equal")
        student_count, Cstudents = tc.cluster_total_no_of_students()
        self.assertEqual(int(student_count), int(Cstudents), msg="Cluster level no of students are not equal")
        student_count, Sstudents = tc.schools_total_no_of_students()
        self.assertEqual(int(student_count), int(Sstudents), msg="Cluster level no of students are not equal")



    def test_home_icon(self):
        home = Student_Exceptions(self.driver,self.year, self.month)
        result = home.click_on_blocks_click_on_home_icon()
        if "Student Attendance Exception" in result:
            print("This is Student Attendance Exception Report page")
        else:
            raise self.failureException('Home Icon is not working')

    def test_home_button(self):
        homebtn = Student_Exceptions(self.driver,self.year, self.month)
        res1,res2 = homebtn.click_HomeButton()
        self.assertEqual(0,res1,msg='Homebutton is not worked')
        if 'student-attendance-exception' in res2:
            print("This is Student Attendance Exception Report page")
        else:
            raise self.failureException('Home button is not working')


    def test_block_per_district_csv_download(self):
        dist = Student_Exceptions(self.driver,self.year, self.month)
        result = dist.check_districts_csv_download()
        if result == 0:
            print("Block per district csv report download is working")
        else:
            raise self.failureException("Block per district csv report download is working")

    def test_cluster_per_block_csv_download(self):
        block = Student_Exceptions(self.driver,self.year, self.month)
        result = block.check_blockwise_csv_download()
        if result == 0:
            print("Cluster per block csv report download is working")
        else:
            raise self.failureException("Cluster per block csv report download is working")

    def test_school_per_cluster_csv_download(self):
        block = Student_Exceptions(self.driver,self.year, self.month)
        result = block.check_clusterwise_csv_download()
        if result == 0:
            print("School per cluster csv report download is working")
        else:
            raise self.failureException("School per cluster csv report download is working")



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
