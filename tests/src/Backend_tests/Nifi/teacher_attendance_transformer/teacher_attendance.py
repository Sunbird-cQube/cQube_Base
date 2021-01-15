import unittest

from reuse_func import GetData


class TeacherAttendanceTransformer(unittest.TestCase):

    def test_teacher_attendance_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("teacher_attendance_transformer")
        if runningcount == 0:
            print("teacher attendance data transformer running count is 0 after installation")
        else:
            self.assertEqual(0,runningcount,"teacher attendance transformer running count is not 0 after installation")

    def test_teacher_attendance_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("teacher_attendance_transformer")
        if disabledCount == 0:
            print("teacher attendance transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"teacher attendance transformer disabled count is not 0 after installation")

    def test_teacher_attendance_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("teacher_attendance_transformer")
        if invalidCount == 0:
            print("teacher attendance transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"teacher attendance transformer invalid count is not 0 after installation")

    def test_teacher_attendance_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("teacher_attendance_transformer")
        if stopped == 0:
            self.assertNotEqual(0,stopped,"teacher attendance transformer stopped count should not be 0 after installation")
        else:
            print("teacher attendance transformer stopped count is"+" "+str(stopped)+" "+"after installation")

if __name__ == '__main__':
    unittest.main()
