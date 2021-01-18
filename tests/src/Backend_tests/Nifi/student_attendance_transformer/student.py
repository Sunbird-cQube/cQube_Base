import unittest

from reuse_func import GetData


class StudentTransformer(unittest.TestCase):

    def test_student_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("student_attendance_transformer")
        if runningcount == 0:
            print("student data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"student data transformer running count is not 0 after installation")

    def test_student_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("student_attendance_transformer")
        if disabledCount == 0:
            print("student data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"student data transformer disabled count is not 0 after installation")

    def test_student_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("student_attendance_transformer")
        if invalidCount == 0:
            print("student data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"student data transformer invalid count is not 0 after installation")

    def test_student_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("student_attendance_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"student data transformer stopped count should not be 0 after installation")
        else:
            print("student data transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
