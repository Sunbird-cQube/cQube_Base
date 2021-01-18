import unittest


from reuse_func import GetData


class Database(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.connection = self.cal.connect_to_postgres()
    def test_database_created(self):
        cur = self.connection.cursor()
        cur.execute("SELECT datname FROM pg_database;")
        list_database = cur.fetchall()
        database_name=self.cal.get_db_name()
        if (database_name,) in list_database:
            print("'{}' Database exist".format(database_name))
        else:
            raise self.failureException("'{}' Database not exist.".format(database_name))
    @classmethod
    def tearDownClass(self):
        print()

