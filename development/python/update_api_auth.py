import requests

kong_admin_url='http://localhost:8001'
emission_url="http://localhost:5000"
emission_access_paths=["/data/infra_score","/data/upload-url","/data/download_url","/data/download_uri","/data/list_s3_files","/data/download","/data/list_s3_buckets","/data/list_log_files","/data/log-download","/data/infra_weights","/data/infra_score"]

service_list=requests.get("{}/{}".format(kong_admin_url,"services")).json()
if len(service_list.get("data"))<1:
    add_service=requests.post("{}/{}".format(kong_admin_url,"services"),data={"name":"flask-api","url":emission_url})

add_route=requests.post("{}/{}".format(kong_admin_url,"services/flask-api/routes"),data={"hosts":["localhost"],"paths":emission_access_paths,"strip_path": "false","methods":["GET","POST"],"name":"emission_access"})

route_list=requests.get("{}/{}".format(kong_admin_url,"routes")).json()
for rout in route_list.get("data"):
    add_route_plugin=requests.post("{}/routes/{}/plugins".format(kong_admin_url,rout.get("id")),data={"name":"jwt"})
