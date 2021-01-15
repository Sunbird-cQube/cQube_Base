import unittest

from reuse_func import GetData

class CompositeTransformer(unittest.TestCase):

    def test_composite_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("composite_transformer")
        if runningcount == 0:
            print("composite transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"composite transformer is at started stage after installation")

    def test_composite_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("composite_transformer")
        if disabledCount == 0:
            print("composite transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"composite data transformer disabled count is not 0 after installation")

    def test_composite_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("composite_transformer")
        if invalidCount == 0:
            print("composite data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"composite data transformer invalid count is not 0 after installation")

    def test_composite_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("composite_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"composite transformer should be at stopped stage after installation")
        else:
            print("composite transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
