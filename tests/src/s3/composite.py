import unittest

from reuse_func import GetData


class Composite(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.composite_files = self.cal.get_s3_files("composite")

    def test_composite_district_file(self):
        flag = False
        for x in self.composite_files:
            if x[len(x) - 1].__contains__("district"):
                print("composite district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("composite district level json file is not generated")

    def test_composite_block_file(self):
        flag = False
        for x in self.composite_files:
            if x[len(x) - 1].__contains__("block"):
                print("composite block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("composite block level json file is not generated")

    def test_composite_cluster_file(self):
        flag = False
        for x in self.composite_files:
            if x[len(x) - 1].__contains__("cluster"):
                print("composite cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("student attendance cluster level json file is not generated")

    def test_composite_school_file(self):
        flag = False
        for x in self.composite_files:
            if x[len(x) - 1].__contains__("school"):
                print("composite school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("composite school level json file is not generated")

    @classmethod
    def tearDownClass(self):
        print("")
