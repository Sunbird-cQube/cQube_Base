import json, yaml
with open('vars/main.yml','r') as yaml_property:
    yaml_config=yaml.safe_load(yaml_property)

with open('nifi_params.json','r') as json_payload:
    param=json.load(json_payload)

for nifi_param in param['component']['parameters']:
    for key in nifi_param:
        if yaml_config.get(nifi_param[key]['name']):
            nifi_param[key]['value']=yaml_config.get(nifi_param[key]['name'])

with open('nifi.json','w') as json_config:
    json.dump(param, json_config)

