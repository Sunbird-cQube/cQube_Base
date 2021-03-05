from Backend_tests.AfterInstallation.check_basedirectory import directory
from Backend_tests.DataBase import check_database_created
from Backend_tests.DataBase import check_db_username_password
from Backend_tests.Nifi.NifiDashboard import nifi
from Backend_tests.Nifi.NifiTimeZone import timezone
from Backend_tests.Nifi.composite_transformer import composite
from Backend_tests.Nifi.crc_transformer import crc
from Backend_tests.Nifi.data_replay_transformer import data_replay
from Backend_tests.Nifi.diksha_transformer import diksha
from Backend_tests.Nifi.infra_transformer import infra
from Backend_tests.Nifi.pat_transformer import pat
from Backend_tests.Nifi.sat_transformer import sat
from Backend_tests.Nifi.semester_transformer import semester
from Backend_tests.Nifi.static_data_transformer import static
from Backend_tests.Nifi.student_attendance_transformer import student
from Backend_tests.Nifi.teacher_attendance_transformer import teacher_attendance
from Backend_tests.Nifi.telemetry_transformer import telemetry
from Backend_tests.Nifi.udise_transformer import udise
from Backend_tests.Nifi.healthcard_transformer import healthcard
from cQubeLoginPage import cqube
from get_dir import pwd
import unittest
from HTMLTestRunner import HTMLTestRunner


class MyTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        print("")

    def test_Issue(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(nifi.NifiDashboard),
            unittest.defaultTestLoader.loadTestsFromTestCase(timezone.NifiTimeZone),
            unittest.defaultTestLoader.loadTestsFromTestCase(static.StaticTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(student.StudentTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(crc.CrcTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(semester.SemesterTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(infra.InfraTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(diksha.DikshaTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(udise.UdiseTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(telemetry.TelemetryTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(pat.PatTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(composite.CompositeTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(healthcard.HealthCardTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(teacher_attendance.TeacherAttendanceTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(sat.SatTransformer),
            unittest.defaultTestLoader.loadTestsFromTestCase(data_replay.DataReplayTransformer)

        ])
        p = pwd()
        outfile = open(p.get_nifi_processor_group_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Nifi Processor Group Functional Test Report',
            verbosity=1,
        )
        runner1.run(functional_test)
        outfile.close()

    def test_Issue1(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(cqube.CqubeLogin)

        ])
        p = pwd()
        outfile = open(p.get_nifi_processor_group_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='cQube login page',
            verbosity=1,
        )

        runner1.run(functional_test)
        outfile.close()

    def test_Issue2(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(directory.CqubeDir)
        ])
        p = pwd()
        outfile = open(p.get_nifi_processor_group_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Check Base Directory Test Report',
            verbosity=1,
        )

        runner1.run(functional_test)
        outfile.close()

    def test_Issue3(self):
        functional_test = unittest.TestSuite()
        functional_test.addTests([
            # file name .class name
            unittest.defaultTestLoader.loadTestsFromTestCase(check_database_created.Database),
            unittest.defaultTestLoader.loadTestsFromTestCase(check_db_username_password.Database)

        ])
        p = pwd()
        outfile = open(p.get_nifi_processor_group_report_path(), "a")

        runner1 = HTMLTestRunner.HTMLTestRunner(
            stream=outfile,
            title='Database Test Report',
            verbosity=1,
        )

        runner1.run(functional_test)
        outfile.close()

    @classmethod
    def tearDownClass(self):
        print("")


if __name__ == '__main__':
    unittest.main()
