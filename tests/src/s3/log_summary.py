import unittest

from reuse_func import GetData


class LogSummary(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.log_summary = self.cal.get_s3_files("log_summary")

    def test_log_summary_static_district_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_district.json"):
                print("log summary district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary district level json file is not generated")

    def test_log_summary_static_block_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_block.json"):
                print("log summary block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary block level json file is not generated")

    def test_log_summary_static_cluster_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_cluster.json"):
                print("log summary cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary cluster level json file is not generated")

    def test_log_summary_static_school_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_school.json"):
                print("log summary school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary school level json file is not generated")

    def test_log_summary_student_attendance_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_student_attendance.json"):
                print("log summary student attendance file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary student attendance level json file is not generated")

    def test_log_summary_crc_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_crc_loc.json"):
                print("log summary crc file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary crc json file is not generated")

    def test_log_summary_sem_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_sem.json"):
                print("log summary sem file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary sem json file is not generated")

    def test_log_summary_infra_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_infra.json"):
                print("log summary infra file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary infra json file is not generated")

    def test_log_summary_diksha_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_diksha.json"):
                print("log summary diksha file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary diksha json file is not generated")

    def test_log_summary_inspection_file(self):
        flag = False
        for x in self.log_summary:
            if x[len(x) - 1].__contains__("log_summary_inspec.json"):
                print("log summary inspection file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("log summary inspection json file is not generated")





    @classmethod
    def tearDownClass(self):
        print("")
