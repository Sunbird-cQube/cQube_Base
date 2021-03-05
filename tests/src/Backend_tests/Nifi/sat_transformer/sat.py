import unittest

from reuse_func import GetData


class SatTransformer(unittest.TestCase):

    def test_sat_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("sat_transformer")
        if runningcount == 0:
            print("sat data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"sat data transformer running count is not 0 after installation")

    def test_sat_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("sat_transformer")
        if disabledCount == 0:
            print("sat data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"sat data transformer disabled count is not 0 after installation")

    def test_sat_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("sat_transformer")
        if invalidCount == 0:
            print("sat data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"sat data transformer invalid count is not 0 after installation")

    def test_sat_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("sat_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"sat data transformer stopped count should not be 0 after installation")
        else:
            print("sat data transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
