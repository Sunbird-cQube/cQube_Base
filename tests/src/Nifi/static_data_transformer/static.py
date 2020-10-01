import unittest

from reuse_func import GetData


class StaticTransformer(unittest.TestCase):

    def test_static_data_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("static_data_transformer")
        if runningcount == 0:
            print("static data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"static data transformer running count is not 0 after installation")

    def test_static_data_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("static_data_transformer")
        if disabledCount == 0:
            print("static data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"static data transformer disabled count is not 0 after installation")

    def test_static_data_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("static_data_transformer")
        if invalidCount == 0:
            print("static data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"static data transformer invalid count is not 0 after installation")

    def test_static_data_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("static_data_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"static data transformer stopped count should not be 0 after installation")
        else:
            print("static data transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
