import os


class pwd():

    def get_system_path(self):
        pwd = os.path.dirname(__file__)
        return pwd

    def get_report_path(self):
        cwd = os.path.dirname(__file__)
        report_path = os.path.join(cwd, 'Report/report.html')
        return report_path

    def get_database_ini_path(self):
        cwd = os.path.dirname(__file__)
        ini = os.path.join(cwd, 'database.ini')
        return ini
    def get_crc_ini_path(self):
        cwd = os.path.dirname(__file__)
        ini = os.path.join(cwd, 'database.ini')
        return ini

    def get_json_data_ini_path(self):
        cwd = os.path.dirname(__file__)
        ini = os.path.join(cwd, 'json_data.ini')
        return ini