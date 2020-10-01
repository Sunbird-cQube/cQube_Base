import unittest

from reuse_func import GetData


class Udise(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.udise = self.cal.get_s3_files("udise")

    def test_udise_district_file(self):
        flag = False
        for x in self.udise:
            if x[len(x) - 1].__contains__("district"):
                print("udise district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("udise district level json file is not generated")

    def test_udise_block_file(self):
        flag = False
        for x in self.udise:
            if x[len(x) - 1].__contains__("block"):
                print("udise block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("udise block level json file is not generated")

    def test_udise_cluster_file(self):
        flag = False
        for x in self.udise:
            if x[len(x) - 1].__contains__("cluster"):
                print("udise cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("udise cluster level json file is not generated")

    def test_udise_school_file(self):
        flag = False
        for x in self.udise:
            if x[len(x) - 1].__contains__("school"):
                print("udise school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("udise school level json file is not generated")

    @classmethod
    def tearDownClass(self):
        print("")
