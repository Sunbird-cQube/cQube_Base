import unittest

from reuse_func import GetData


class UdiseTransformer(unittest.TestCase):

    def test_udise_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("udise_transformer")
        if runningcount == 0:
            print("udise data transformer running count is 0 after installation")
        else:
            self.assertEqual(0, runningcount, "udise data transformer running count is not 0 after installation")

    def test_udise_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("udise_transformer")
        if disabledCount == 0:
            print("udise data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"udise data transformer disabled count is not 0 after installation")

    def test_udise_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("udise_transformer")
        if invalidCount == 0:
            print("udise data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"udise data transformer invalid count is not 0 after installation")

    def test_udise_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("udise_transformer")
        if stopped == 0:
            self.assertNotEqual(0, stopped, "udise data transformer stopped count should not be 0 after installation")
        else:
            print("udise data transformer stopped count is" + " " + str(stopped) + " " + "after installation")

if __name__ == '__main__':
    unittest.main()
