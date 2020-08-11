import requests
from client import *


uri=emission_url #ex: https://<domain_name>/data/ or http://localhost:5000/
headers={'Content-Type': 'application/json'}

#update the details with emission_user & emission_password
payload={"username":"emission_user","password":"emission_password"}

#get the access_token
resp=requests.post(uri+'auth', headers=headers, json=payload)

#Download the current infrastructure_score.csv weights.
if resp.status_code==200:
	headers={"Authorization":"Bearer {}".format(resp.json().get('access_token'))}
	infra_score=requests.get(uri+'infra_score',headers=headers)
	with open('infrastucture_score.csv','wb') as fd:
		fd.write(infra_score.content)
else:
	print("failed to get the infrastructure score")




#Update the infrastructure_score.csv file with approriate weights.
# After changes call the below api endpoint to update the infrastructure weights. 

files = [   ('file', open('infrastructure_score.csv','rb')) ]
update_score_resp=requests.post(uri+'/infra_weights', headers=headers, files = files))
print(update_score_resp.text)
