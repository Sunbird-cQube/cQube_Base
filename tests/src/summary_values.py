import configparser

from get_dir import pwd


class summary_records():
    def __init__(self):
        self.p = pwd()

    def get_std_file_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['student_filename']

    def get_std_total_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_total_records']

    def get_std_processed_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_processed_records']

    def get_std_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_blank_records']

    def get_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_duplicate_records']

    def get_dtypemismatch_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_dtype_mismatch']

    def get_std_processed_start_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_processor_starttime']


    def get_process_end_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_processor_endtime']

    def get_std_attendance_id_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_attendance_id']

    def get_std_student_id_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_student_id']

    def get_std_school_id_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_school_id']

    def get_std_year_in_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_year']

    def get_std_month_in_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_month']


    #second record
    def get_std2_total_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_total_2']

    def get_std2_processed_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_processed_2']

    # third record

    def get_std3_total_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_total_3']

    def get_std3_processed_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['student']['std_processed_3']


    #Semester
    def get_semester_file_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['semester_filename']

    def get_sem_total_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_total_records']

    def get_sem_processed_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_processed_records']

    def get_sem_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_blank_records']

    def get_sem_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_duplicate_records']

    def get_sem_dtypemismatch_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_dtype_mismatch']


    def get_sem_student_id_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_student_id']

    def get_sem_school_id_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_school_id']

    def get_sem_semester_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_semester']

    def get_sem_grade_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['semester']['sem_grade']

    #crc report

    def get_crc_userlocation_file(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_userloc']

    def get_crc_totalrecords(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_totalrecords']

    def get_crc_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_blank_records']

    def get_crc_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_duplicate_records']

    def get_crc_school_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_school_id']

    def get_crc_inspection(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_inspection']

    def get_crc_schoolloc(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_schoolloc']

    def get_crc_createon(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_createon']

    def get_crc_latitude(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_latitude']

    def get_crc_longitude(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_longitude']

    def get_crc_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['crc']['crc_processedrec']

    #infra
    def get_infra__file(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['infra']['infra_filename']

    def get_infra_totalrecords(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['infra']['infra_totalrecords']

    def get_infra_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['infra']['infra_blank_records']

    def get_infra_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['infra']['infra_duplicate_records']

    def get_infra_school_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['infra']['infra_school_id']

    def get_infra_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['infra']['infra_processedrec']

    #inspection
    def get_inspection_master(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['inspection_master']

    def get_insp_totalrecords(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_totalrecords']

    def get_insp_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_blank_records']

    def get_insp_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_duplicate_records']

    def get_insp_datatypemismatch(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_datatypemismatch']

    def get_insp_school_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_school_id']

    def get_insp_inspection(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_inspection']

    def get_insp_createon(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_createon']


    def get_insp_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['inspection']['insp_processedrec']

    #statis District
    def get_static_district_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_filename']

    def get_static_district_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_totalrec']

    def get_static_district_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_blank_records']

    def get_static_district_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_duplicate_records']

    def get_static_district_datatypemis(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_datatypemis']

    def get_static_district_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_name']

    def get_static_district_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_id']

    def get_static_district_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['statdistrict']['district_processedrec']

    #Staticblock
    def get_static_block_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_filename']

    def get_static_block_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_totalrec']

    def get_static_block_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_blank_records']

    def get_static_block_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_duplicate_records']

    def get_static_block_datatype(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_datatype']

    def get_static_block_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_name']

    def get_static_block_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_id']

    def get_static_block_district_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['district_id']

    def get_static_block_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticblock']['block_processedrec']

    #statis cluster
    def get_static_cluster_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_filename']

    def get_static_cluster_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_totalrec']

    def get_static_cluster_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_blank_records']

    def get_static_cluster_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_duplicate_records']

    def get_static_cluster_datatype(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_datatype']

    def get_static_cluster_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_name']

    def get_static_cluster_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_id']

    def get_static_cluster_block_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['block_id']

    def get_static_cluster_district_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['district_id']

    def get_static_cluster_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticcluster']['cluster_processedrec']

    #static school
    def get_static_school_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_filename']

    def get_static_school_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_totalrec']

    def get_static_school_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_blank_records']

    def get_static_school_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_duplicate_records']

    def get_static_school_datatype(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_datatype']

    def get_static_school_name(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_name']

    def get_static_school_latitude(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_latitude']

    def get_static_school_longitude(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_longitude']

    def get_static_school_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['staticschool']['school_processedrec']

    #Diksha
    def get_diksha_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_filename']

    def get_diksha_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_totalrec']

    def get_diksha_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_blank_records']

    def get_diksha_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_duplicate_records']

    def get_diksha_datamismatch(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_datamismatch']

    def get_diksha_contentview(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentview']

    def get_diksha_dimpdata(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_dimpdata']


    def get_diksha_dimension_pid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_dimension_pid']

    def get_diksha_contentname(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentname']

    def get_diksha_contentboard(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentboard']

    def get_diksha_contentmimetype(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentmimetype']

    def get_diksha_contentmedium(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentmedium']

    def get_diksha_contentgradelevel(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentgradelevel']

    def get_diksha_contentsubject(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_contentsubject']

    def get_diksha_objectid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_objectid']

    def get_diksha_objrollup(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_objrollup']

    def get_diksha_locstate(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_locstate']

    def get_diksha_locdistrict(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_locdistrict']

    def get_diksha_usersignin(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_usersignin']

    def get_diksha_userlogintype(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_userlogintype']

    def get_diksha_collectiontype(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_collectiontype']

    def get_diksha_totalcount(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_totalcount']


    def get_diksha_totaltimespent(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_totaltimespent']

    def get_diksha_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['diksha']['diksha_processedrec']

    #Udise
    def get_udise_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_filename']

    def get_udise_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_totalrec']

    def get_udise_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_blank_records']

    def get_udise_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_duplicate_records']

    def get_udise_schcode(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_schcode']

    def get_udise_sectorno(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_sectorno']

    def get_udise_itemid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_itemid']

    def get_udise_classid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_classid']

    def get_udise_streamid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_streamid']

    def get_udise_grade(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_grade']

    def get_udise_incentives(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_incentives']

    def get_udise_casteid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_casteid']

    def get_udise_disability(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_disability']

    def get_udise_medinstr(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_medinstr']

    def get_udise_ageid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_ageid']

    def get_udise_itemgrp(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_itemgrp']

    def get_udise_tchcode(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_tchcode']

    def get_udise_marks_range(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_marks_range']

    def get_udise_nsqf(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_nsqf']

    def get_udise_processedrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['udise']['udise_processedrec']

    #patdata

    def get_pat_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_filename']

    def get_pat_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_totalrec']

    def get_pat_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_blank_records']

    def get_pat_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_duplicate_records']

    def get_pat_datamismatch(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_datamismatch']

    def get_pat_student_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_student_id']

    def get_pat_school_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_school_id']

    def get_pat_semester(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_semester']

    def get_pat_grade(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_grade']

    def get_pat_processed_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['patdata']['pat_processed_records']
    #diksha tpd
    def get_tpd_filename(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_filename']

    def get_tpd_totalrec(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_totalrec']

    def get_tpd_blank_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_blank_records']

    def get_tpd_duplicate_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_duplicate_records']

    def get_tpd_datamismatch(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_datamismatch']

    def get_tpd_coll_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_coll_id']

    def get_tpd_uuid_id(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_uuid_id']

    def get_tpd_schoolid(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_schoolid']

    def get_pat_processed_records(self):
        config = configparser.ConfigParser()
        config.read(self.p.get_summary_statistics_path())
        return config['dikshatpd']['tpd_processed_records']


