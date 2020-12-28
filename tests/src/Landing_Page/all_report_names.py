



import unittest
from Landing_Page.ui_report_changes import cQube_All_Reports
from reuse_func import GetData

class cQube_Home(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)

    def test_infrastructure_location_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_infrastructure_by_location()
        self.assertEqual(result, "Infrastructure access by location report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_composite_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_composite_report()
        self.assertEqual(result, "Composite report for: Gujarat",msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_udise_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_udise_report()
        self.assertEqual(result, "UDISE report for: Gujarat",msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_composite_across_metrics_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_composite_accross_metrics_report()
        self.assertEqual(result, "Composite report across matrics for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_usage_by_course_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_usage_by_course()
        self.assertEqual(result, "Course linked content usage: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_usage_by_course_content_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_usage_by_course_content()
        self.assertEqual(result, "Course linked content usage: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_usage_by_textbook_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_usage_by_textbook()
        self.assertEqual(result, "Textbook linked content usage: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_usage_by_textbook_content_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_usage_by_textbook_content()
        self.assertEqual(result, "Textbook linked content usage: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_crc(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_CRC()
        self.assertEqual(result,"CRC report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_tpd_course_progress(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_tpd_course_progress()
        self.assertEqual(result, "Diksha TPD Course Progress report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_tpd_course_teacher(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_tpd_course_teacher_progress()
        self.assertEqual(result,"Diksha TPD Teachers Percentage report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_tpd_enrollment(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_enrollment_icon()
        self.assertEqual(result, "Diksha TPD report for total enrollments / Completions: Gujarat",
                         msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_tpd_completion_percentage(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_completion_percentage_icon()
        self.assertEqual(result, "Diksha TPD report for completion percentage: Gujarat",
                         msg='Report name is not in proper')
        self.data.page_loading(self.driver)


    def test_semester_report(self):
        b =cQube_All_Reports(self.driver)
        result = b.test_Semester()
        self.assertEqual(result,"Semester report for: Gujarat",msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_periodic_map_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_periodic_report()
        self.assertEqual(result,"Periodic Assessment Test report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_periodic_heatchart_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_periodic_heat_chart()
        self.assertEqual(result, "Periodic Assessment Test Heat chart report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_periodic_lo_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_periodic_heat_chart()
        self.assertEqual(result, "Periodic Assessment Test LO report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_semester_exception_report(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_semester_exception()
        self.assertEqual(result, "Semester exception report for: Gujarat", msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_completion_error(self):
        b = cQube_All_Reports(self.driver)
        result = b.test_completionerror()
        self.assertEqual(result, "Download missing data", msg='Report name is not in proper')
        self.data.page_loading(self.driver)




    def test_student_attendance_report(self):
        b =cQube_All_Reports(self.driver)
        result = b.test_SAR()
        self.assertEqual(result,"Attendance report for: Gujarat",msg='Report name is not in proper')
        self.data.page_loading(self.driver)

    def test_teacher_attendance_report(self):
        b =cQube_All_Reports(self.driver)
        result = b.test_TAR()
        self.data.page_loading(self.driver)

    def test_Telemetry_report(self):
        b =cQube_All_Reports(self.driver)
        result = b.test_telemetry_report()
        self.assertEqual(result,"Telemetry data for: District Level",msg='Report name is not in proper')
        self.data.page_loading(self.driver)




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()