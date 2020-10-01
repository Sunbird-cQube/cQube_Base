import unittest

from reuse_func import GetData


class Semester(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.semester = self.cal.get_s3_files("semester")

    def test_semester_district_file(self):
        flag = False
        for x in self.semester:
            if x[len(x) - 1].__contains__("district"):
                print("semester district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("semester district level json file is not generated")

    def test_semester_block_file(self):
        flag = False
        for x in self.semester:
            if x[len(x) - 1].__contains__("block"):
                print("semester block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("semester block level json file is not generated")

    def test_semester_cluster_file(self):
        flag = False
        for x in self.semester:
            if x[len(x) - 1].__contains__("cluster"):
                print("semester cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("semester cluster level json file is not generated")

    def test_semester_school_file(self):
        flag = False
        for x in self.semester:
            if x[len(x) - 1].__contains__("school"):
                print("semester school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("semester school level json file is not generated")

    @classmethod
    def tearDownClass(self):
        print("")
