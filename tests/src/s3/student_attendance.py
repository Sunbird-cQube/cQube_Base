import unittest

from reuse_func import GetData


class student(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.student_files = self.cal.get_s3_files("attendance")

    def test_student_district_file(self):
        flag = False
        for x in self.student_files:
            if x[len(x) - 1].__contains__("district"):
                print("student attendance district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("student attendance district level json file is not generated")

    def test_student_block_file(self):
        flag = False
        for x in self.student_files:
            if x[len(x) - 1].__contains__("block"):
                print("student attendance block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("student attendance block level json file is not generated")

    def test_student_cluster_file(self):
        flag = False
        for x in self.student_files:
            if x[len(x) - 1].__contains__("cluster"):
                print("student attendance cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("student attendance cluster level json file is not generated")

    def test_student_school_file(self):
        flag = False
        for x in self.student_files:
            if x[len(x) - 1].__contains__("school"):
                print("student attendance school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("student attendance school level json file is not generated")

    @classmethod
    def tearDownClass(self):
        print("")
