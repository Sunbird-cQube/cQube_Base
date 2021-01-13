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
'static_data_transformer':{"state":"RUNNING","time": {"hours": "10", "minutes": "00"}, "stopTime": 1},
'pat_transformer':{"state":"RUNNING","time": {"hours": "11", "minutes": "10"}, "stopTime": 2},
'infra_transformer_validations':{"state":"RUNNING","time": {"hours": "13", "minutes": "20"}, "stopTime": 1},
'crc_transformer':{"state":"RUNNING","time": {"hours": "14", "minutes": "30"}, "stopTime": 2},
'infra_transformer':{"state":"RUNNING","time": {"hours": "16", "minutes": "40"}, "stopTime": 1},
'udise_transformer':{"state":"RUNNING","time": {"hours": "17", "minutes": "50"}, "stopTime": 2},
'student_attendance_transformer':{"state":"RUNNING","time": {"hours": "20", "minutes": "00"}, "stopTime": 1},
'semester_transformer':{"state":"RUNNING","time": {"hours": "21", "minutes": "10"}, "stopTime": 1},
'diksha_transformer':{"state":"RUNNING","time": {"hours": "00", "minutes": "20"}, "stopTime": 4},
'teacher_attendance_transformer':{"state":"RUNNING","time": {"hours": "04", "minutes": "30"}, "stopTime": 1},
'composite_transformer':{"state":"RUNNING","time": {"hours": "05", "minutes": "40"}, "stopTime": 1},
'healthcard_transformer':{"state":"RUNNING","time": {"hours": "06", "minutes": "50"}, "stopTime": 1}
}
	try:
		for x,y in pg_list.items():
			uri='http://localhost:3001/api/nifi/scheduleNiFiProcessor/{}/{}'.format(y,x)
			if data_source.get(x):
				payload=data_source.get(x)
			else:
				payload={"state":"RUNNING", "time": {"hours": "22", "minutes": "00"}, "stopTime": 5}
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
