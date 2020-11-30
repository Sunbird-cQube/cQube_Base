import psycopg2
from nifi_env_db import db_name,db_pwd,db_user
import logging


logging.basicConfig(level=logging.DEBUG)

def remove_special_characters(data):
    """
    removes '\n', (' , space and ',)
    """
    data = str(data)
    data = data.replace("\\n","")
    data = data.replace("\\t","")
    data = data.replace("('","")
    data = data.replace("',)","")
    return data



def get_jolt_spec(spec_type):
    """
    Get the jolt spec from db
    """
    try:
        connection = psycopg2.connect(user = db_user,
                                    password = db_pwd,
                                    host = "localhost",
                                    database = db_name)

        cursor = connection.cursor()
        
        cursor.execute("select jolt_spec from {}".format(spec_type))
        record = cursor.fetchone()
        res=remove_special_characters(record)
        return res

    except (Exception, psycopg2.Error) as error :
        logging.error("Error while connecting to PostgreSQL", error)
        print("Error while connecting to PostgreSQL", error)
    
    finally:
        #closing database connection.
            if(connection):
                cursor.close()
                connection.close()
                
