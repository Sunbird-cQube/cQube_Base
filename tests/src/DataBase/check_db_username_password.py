import unittest


from reuse_func import GetData


class Database(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
    def test_database_username_password(self):
        self.connection = self.cal.connect_to_postgres()
        if self.connection is not None:
            print("Database configured with provided username and password")
        else:
            raise self.failureException("Database is not configured with provided username and password")
    @classmethod
    def tearDownClass(self):
        print()

