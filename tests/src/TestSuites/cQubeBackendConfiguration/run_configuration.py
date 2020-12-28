
from AfterInstallation.check_basedirectory import directory
from DataBase import check_database_created, check_db_username_password
from Nifi.NifiDashboard import nifi
from Nifi.NifiTimeZone import timezone
from Nifi.composite_transformer import composite
from Nifi.crc_transformer import crc
from Nifi.diksha_transformer import diksha
from Nifi.infra_transformer import infra
from Nifi.pat_transformer import pat
from Nifi.semester_transformer import semester
from Nifi.static_data_transformer import static
from Nifi.student_attendance_transformer import student
from Nifi.telemetry_transformer import telemetry
from Nifi.udise_transformer import udise
from Nifi.healthcard_transformer import healthcard
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
            unittest.defaultTestLoader.loadTestsFromTestCase(healthcard.HealthCardTransformer)

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
