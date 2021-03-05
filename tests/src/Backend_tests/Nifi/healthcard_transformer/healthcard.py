import unittest

from reuse_func import GetData

class HealthCardTransformer(unittest.TestCase):

    def test_healthcard_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("healthcard_transformer")
        if runningcount == 0:
            print("healthcard transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"healthcard transformer is at started stage after installation")

    def test_healthcard_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("healthcard_transformer")
        if disabledCount == 0:
            print("healthcard transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"healthcard data transformer disabled count is not 0 after installation")

    def test_healthcard_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("healthcard_transformer")
        if invalidCount == 0:
            print("healthcard data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"healthcard data transformer invalid count is not 0 after installation")

    def test_healthcard_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("healthcard_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"healthcard transformer should be at stopped stage after installation")
        else:
            print("healthcard transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
