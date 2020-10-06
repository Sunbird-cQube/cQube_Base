import unittest

from reuse_func import GetData


class CRC(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.crc_files = self.cal.get_s3_files("crc")

    def test_crc_district_file(self):
        flag = False
        for x in self.crc_files:
            if x[len(x) - 1].__contains__("district"):
                print("crc district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("crc district level json file is not generated")

    def test_crc_block_file(self):
        flag = False
        for x in self.crc_files:
            if x[len(x) - 1].__contains__("block"):
                print("crc block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("crc block level json file is not generated")

    def test_crc_cluster_file(self):
        flag = False
        for x in self.crc_files:
            if x[len(x) - 1].__contains__("cluster"):
                print("crc cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("student attendance cluster level json file is not generated")

    def test_crc_school_file(self):
        flag = False
        for x in self.crc_files:
            if x[len(x) - 1].__contains__("school"):
                print("crc school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("crc school level json file is not generated")

    @classmethod
    def tearDownClass(self):
        print("")
