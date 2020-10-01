import unittest

from reuse_func import GetData


class Pat(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.comp_files = self.cal.get_pat_grades_files()

    def test_pat_district_file(self):
        self.pat_files = self.cal.get_s3_files("pat/district/")
        s3_district_files = []
        for x in self.pat_files:
            s3_district_files.append(x[len(x) - 1])
        self.assertListEqual(s3_district_files, self.comp_files, "some of the district grade files are missed")
        
    def test_pat_block_file(self):
        self.pat_files = self.cal.get_s3_files("pat/block/")
        s3_block_files = []
        for x in self.pat_files:
            s3_block_files.append(x[len(x) - 1])
        self.assertListEqual(s3_block_files, self.comp_files, "some of the block grade files are missed")
        
    def test_pat_cluster_file(self):
        self.pat_files = self.cal.get_s3_files("pat/cluster/")
        s3_cluster_files = []
        for x in self.pat_files:
            s3_cluster_files.append(x[len(x) - 1])
        self.assertListEqual(s3_cluster_files, self.comp_files, "some of the cluster grade files are missed")
        
    def test_pat_school_file(self):
        self.pat_files = self.cal.get_s3_files("pat/school/")
        s3_school_files = []
        for x in self.pat_files:
            s3_school_files.append(x[len(x) - 1])
        self.assertListEqual(s3_school_files, self.comp_files, "some of the school grade files are missed")

    @classmethod
    def tearDownClass(self):
        print("")
