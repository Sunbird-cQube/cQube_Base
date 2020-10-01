import os
import unittest

from reuse_func import GetData


class CqubeDir(unittest.TestCase):
    def test_base_directory_created(self):
        data = GetData()
        os.chdir(data.get_basedir())
        self.assertTrue(os.path.isdir("cqube"),"cQube base directory is not created")