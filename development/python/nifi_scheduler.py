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
	payload={"state":"RUNNING", "time": {"hours": "22", "minutes": "00"}, "stopTime": 5}
	try:
		for x,y in pg_list.items():
			uri='http://localhost:3001/api/nifi/scheduleNiFiProcessor/{}/{}'.format(y,x)
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
