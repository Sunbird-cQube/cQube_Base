import unittest

from reuse_func import GetData


class DataReplayTransformer(unittest.TestCase):

    def test_data_replay_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("data_replay_transformer")
        if runningcount == 0:
            print("data replay data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"data replay data transformer running count is not 0 after installation")

    def test_data_replay_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("data_replay_transformer")
        if disabledCount == 0:
            print("data replay data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"data replay data transformer disabled count is not 0 after installation")

    def test_data_replay_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("data_replay_transformer")
        if invalidCount == 0:
            print("data replay data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"data replay data transformer invalid count is not 0 after installation")

    def test_data_replay_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("data_replay_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"data replay data transformer stopped count should not be 0 after installation")
        else:
            print("data replay data transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
