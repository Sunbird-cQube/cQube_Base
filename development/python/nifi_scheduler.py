from nifi_env_db import nifi_port
import requests
import logging

def get_processor_groups():
        pg_resp=requests.get('http://localhost:{}/nifi-api/process-groups/root/process-groups'.format(nifi_port))
        pg_list=dict()
        if pg_resp.status_code==200:
                for pg in pg_resp.json().get('processGroups'):
                        if pg['component']['name']!='cqube_telemetry_transformer':
                                pg_list[pg['component']['name']]=pg.get('id')
        else:
                logging.error("Unable to get the process group details, due to {}".format(pg_resp.text))
        return pg_list

def schedule_processor_groups(pg_list):
	headers={"Content-Type":"application/json"}
	data_source={
'static_data_transformer':{"state":"RUNNING","time":"10:00", "stopTime": 1},
'pat_transformer':{"state":"RUNNING","time":"11:15", "stopTime": 2},
'infra_transformer_validations':{"state":"RUNNING","time":"13:25", "stopTime": 1},
'crc_transformer':{"state":"RUNNING","time":"14:00", "stopTime": 2},
'infra_transformer':{"state":"RUNNING","time":"16:10", "stopTime": 1},
'udise_transformer':{"state":"RUNNING","time":"19:00", "stopTime": 2},
'student_attendance_transformer':{"state":"RUNNING","time":"21:10", "stopTime": 1},
'semester_transformer':{"state":"RUNNING","time":"22:30", "stopTime": 1},
'diksha_transformer':{"state":"RUNNING","time":"00:15", "stopTime": 4},
'teacher_attendance_transformer':{"state":"RUNNING","time":"04:25", "stopTime": 1},
'composite_transformer':{"state":"RUNNING","time":"05:30", "stopTime": 1},
'healthcard_transformer':{"state":"RUNNING","time":"06:35", "stopTime": 1}
}
	payload={"state":"RUNNING", "time":"22:00", "stopTime": 5}
	try:
		for x,y in pg_list.items():
			uri='http://localhost:3001/api/nifi/scheduleNiFiProcessor/{}/{}'.format(y,x)
			if data_source.get(x):
				payload=data_source.get(x)
			pg_resp=requests.post(uri,headers=headers,json=payload)
			if pg_resp.status_code==200:
				logging.info("Sucessfully scheduled the processor group {}".format(x))
			else:
				logging.error("Failed to schedule the processor group {} due to error: {}".format(x,pg_resp.text))
	except Exception as err:
		logging.error("Unexpected error :{} while scheduling the processor group {}".format(err, x))
		

if __name__=="__main__":
	pg_list=get_processor_groups()
	if pg_list:
		schedule_processor_groups(pg_list)
	else:
		logging.error("Failed to schedule, unable to fetch the process group details")
