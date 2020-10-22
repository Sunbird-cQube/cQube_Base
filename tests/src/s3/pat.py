import unittest
from reuse_func import GetData


class Pat(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()

    # pat all files
    def test_district_wise_pat_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("all","district")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
        
    def test_block_wise_pat_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("all","block")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
        
    def test_cluster_wise_pat_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("all","cluster")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
        
    def test_school_wise_pat_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("all","school")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
        
        # pat last 7 days files
    def test_district_wise_pat_last_7_days_files(self):
        last_7_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_7_days","district")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_7_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_7_days_files_in_s3, "files are missing")
        
    def test_block_wise_pat_last_7_days_files(self):
        last_7_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_7_days","block")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_7_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_7_days_files_in_s3, "files are missing")
        
    def test_cluster_wise_pat_last_7_days_files(self):
        last_7_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_7_days","cluster")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_7_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_7_days_files_in_s3, "files are missing")
        
    def test_school_wise_pat_last_7_days_files(self):
        last_7_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_7_days","school")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_7_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_7_days_files_in_s3, "files are missing")

        # pat 30 days files
    def test_district_wise_pat_last_30_days_files(self):
        last_30_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_30_days","district")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_30_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_30_days_files_in_s3, "files are missing")
        
    def test_block_wise_pat_last_30_days_files(self):
        last_30_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_30_days","block")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_30_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_30_days_files_in_s3, "files are missing")
        
    def test_cluster_wise_pat_last_30_days_files(self):
        last_30_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_30_days","cluster")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_30_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_30_days_files_in_s3, "files are missing")
        
    def test_school_wise_pat_last_30_days_files(self):
        last_30_days_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_files("last_30_days","school")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                last_30_days_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, last_30_days_files_in_s3, "files are missing")

    def test_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_levels_files("all")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
        
    def test_last_30_days_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_levels_files("last_30_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
        
    def test_last_7_days_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_cmp_pat_levels_files("last_7_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")



