import unittest

from reuse_func import GetData


class Schoolinfra(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.infra = self.cal.get_s3_files("infra")

    def test_infra_map_district_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_district_map"):
                print("infra map district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra map district level json file is not generated")

    def test_infra_map_block_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_block_map"):
                print("infra map block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra map block level json file is not generated")

    def test_infra_map_cluster_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_cluster_map"):
                print("infra map cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra map cluster level json file is not generated")

    def test_infra_map_school_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_school_map"):
                print("infra map school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra map school level json file is not generated")

    def test_infra_table_district_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_district_table"):
                print("infra table district file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra table district level json file is not generated")

    def test_infra_table_block_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_block_table"):
                print("infra table block file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra table block level json file is not generated")

    def test_infra_table_cluster_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_cluster_table"):
                print("infra table cluster file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra table cluster level json file is not generated")

    def test_infra_table_school_file(self):
        flag = False
        for x in self.infra:
            if x[len(x) - 1].__contains__("infra_school_table"):
                print("infra table school file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("infra table school level json file is not generated")

    @classmethod
    def tearDownClass(self):
        print("")
