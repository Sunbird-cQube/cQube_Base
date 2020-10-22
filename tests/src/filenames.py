import configparser
import os


class file_extention():

    def get_config_ini_path(self):
        cwd = os.path.dirname(__file__)
        ini = os.path.join(cwd, 'config.ini')
        return ini

    # Semester Report
    def sr_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_block']

    def sr_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_cluster']

    def sr_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_school']

    def sr_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_districtwise']

    def sr_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_blockwise']

    def sr_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_clusterwise']

    def sr_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sr_district']

    #exception
    def exception_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_block']

    def exception_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_cluster']

    def exception_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_school']

    def exception_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_districtwise']

    def exception_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_blockwise']

    def exception_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_clusterwise']

    def exception_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['exception_district']

    #crc report
    def crc_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_block']

    def crc_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_cluster']

    def crc_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_school']

    def crc_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_districtwise']

    def crc_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_blockwise']

    def crc_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_clusterwise']

    def crc_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['crc_district']

    # composite report
    def composite_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['composite_block']

    def composite_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['composite_cluster']

    def composite_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['composite_districtwise']

    def composite_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['composite_blockwise']

    def composite_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['composite_clusterwise']

    def composite_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['composite_district']
    
    #School infra map report
    def scmap_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_block']

    def scmap_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_cluster']

    def scmap_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_school']

    def scmap_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_districtwise']

    def scmap_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_blockwise']

    def scmap_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_clusterwise']

    def scmap_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['scmap_district']
    
    #udise
    def udise_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_block']

    def udise_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_cluster']

    def udise_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_school']

    def udise_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_districtwise']

    def udise_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_blockwise']

    def udise_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_clusterwise']

    def udise_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['udise_district']
    
    #School infra scattor plot
    def sc_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_block']

    def sc_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_district']

    def sc_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_cluster']

    def sc_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_school']

    def sc_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_districtwise']

    def sc_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_blockwise']

    def sc_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['sc_clusterwise']

    #Disha stacked
    def diksha_stack_all(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['diksha_stack_all']

    def diksha_stack_teacher(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['diksha_stack_teacher']

    def diskha_stack_student(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['diskha_stack_student']

    def diskha_stack_others(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['diskha_stack_others']

    # Telemetry report

    def telemtry_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemtry_block']

    def telemetry_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemetry_cluster']

    def telemetry_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemetry_school']

    def telemetry_overall(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemetry_overall']

    def telemetry_last7days(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemetry_last7days']

    def telemetry_lastday(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemetry_lastday']

    def telemetry_lastmonth(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['telemetry_lastmonth']

    # completion error
    def school_invalid_data(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['completion_error']

    #Periodic report
    def pat_block(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_block']

    def pat_cluster(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_cluster']

    def pat_school(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_school']

    def pat_districtwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_districtwise']

    def pat_blockwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_blockwise']

    def pat_clusterwise(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_clusterwise']

    def pat_district(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['pat_district']

    def completion_error(self):
        config = configparser.ConfigParser()
        config.read(self.get_config_ini_path())
        return config['config']['completion_error']