import unittest

from reuse_func import GetData


class TelemetryTransformer(unittest.TestCase):

    def test_telemetry_transformer_runningcount(self):
        cal = GetData()
        runningcount = cal.get_runningCount("cqube_telemetry_transformer")
        if runningcount == 0:
            self.assertNotEqual(0, runningcount, "cqube telemetry data transformer is not at started stage after installation")
        else:
            print("cqube telemetry data transformer running count is "+str(runningcount)+" after installation")

    def test_telemetry_transformer_disabledCount(self):
        cal = GetData()
        disabledCount = cal.get_disabledCount("cqube_telemetry_transformer")
        if disabledCount == 0:
            print("cqube telemetry data transformer disabled count is 0 after installation")
        else:
            self.assertEqual(0,disabledCount,"cqube telemetry data transformer disabled count is not 0 after installation")

    def test_telemetry_transformer_invalidCount(self):
        cal = GetData()
        invalidCount = cal.get_invalidCount("cqube_telemetry_transformer")
        if invalidCount == 0:
            print("cqube telemetry data transformer invalid count is 0 after installation")
        else:
            self.assertEqual(0,invalidCount,"cqube telemetry data transformer invalid count is not 0 after installation")

    def test_telemetry_transformer_stoppedCount(self):
        cal = GetData()
        stopped = cal.get_stoppedCount("cqube_telemetry_transformer")
        if stopped == 0:
            print("cqube telemetry data transformer stopped count is 0 after installation")
        else:
            self.assertNotEqual(0, stopped, "cqube telemetry data transformer stopped count should not be 0 after installation")

if __name__ == '__main__':
    unittest.main()
