import unittest

from reuse_func import GetData


class SemesterTransformer(unittest.TestCase):

    def test_semester_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("semester_transformer")
        if runningcount == 0:
            print("semester data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"semester data transformer running count is not 0 after installation")

    def test_semester_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("semester_transformer")
        if disabledCount == 0:
            print("semester data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"semester data transformer disabled count is not 0 after installation")

    def test_semester_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("semester_transformer")
        if invalidCount == 0:
            print("semester data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"semester data transformer invalid count is not 0 after installation")

    def test_semester_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("semester_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"semester data transformer stopped count should not be 0 after installation")
        else:
            print("semester data transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
