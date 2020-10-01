import unittest

from reuse_func import GetData

class PatTransformer(unittest.TestCase):

    def test_pat_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("pat_transformer")
        if runningcount == 0:
            print("pat transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"pat transformer running count is not 0 after installation")

    def test_pat_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("pat_transformer")
        if disabledCount == 0:
            print("pat transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"pat data transformer disabled count is not 0 after installation")

    def test_pat_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("pat_transformer")
        if invalidCount == 0:
            print("pat data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"pat data transformer invalid count is not 0 after installation")

    def test_pat_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("pat_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"pat transformer stopped count should not be 0 after installation")
        else:
            print("pat transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
