import unittest

from reuse_func import GetData


class InfraTransformer(unittest.TestCase):

    def test_infra_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("infra_transformer")
        if runningcount == 0:
            print("infra data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"infra data transformer running count is not 0 after installation")

    def test_infra_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("crc_transformer")
        if disabledCount == 0:
            print("infra data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"infra data transformer disabled count is not 0 after installation")

    def test_infra_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("crc_transformer")
        if invalidCount == 0:
            print("infra data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"infra data transformer invalid count is not 0 after installation")

    def test_infra_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("crc_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"infra data transformer stopped count should not be 0 after installation")
        else:
            print("infra data transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
