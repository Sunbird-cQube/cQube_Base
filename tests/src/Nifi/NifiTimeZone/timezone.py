import unittest

from reuse_func import GetData


class NifiTimeZone(unittest.TestCase):

    def test_time_zone(self):
        cal = GetData()
        time_zone = cal.get_time_zone()
        time_zone=time_zone.split(" ")
        self.assertEqual("IST",time_zone[1],"time zone is not configured with IST instead it is configured with "+time_zone[1])


if __name__ == '__main__':
    unittest.main()
