import requests
import logging
import get_jolt_spec_db as jolt_spec


logging.basicConfig(level=logging.DEBUG)


def parameters_builder(name,sensitive,value="",description=""):
    """
    Function creates the parameter
    """
    parameter = {"parameter":{"name":"","sensitive":"","value":"","description":""}}
    parameter['parameter']['name']=name
    parameter['parameter']['sensitive']=sensitive
    parameter['parameter']['value']=value
    parameter['parameter']['description']=description
    return parameter

def parameter_list_builder(parameter_name,config_parameters):
    """
    Function creates the parameter body
    """
    parameters_list = [ parameters_builder(parameter_name,False,config_parameters)]
    par_data = {"revision":{"clientId":"","version":""},"id":"","component":{"id":"","name":"","description":"","parameters":[]}}
    par_data['component']['parameters'] = parameters_list
    return par_data


def get_parameter_context(parameter_context):
    """
    Function will get the parameter context details
    """
    res = requests.get('http://localhost:8096/nifi-api/flow/parameter-contexts')
    if res.status_code == 200:
        for i in res.json()['parameterContexts']:
            if i['component']['name'] == parameter_context:
                return {"id":i['id'],"version":i['revision']['version'],"name":i['component']['name']}
    else:
        logging.error("Failed to get parameter contexts")
        return {"Error":"Failed to get parameter contexts","error":res.json()}


def update_parameters(nifi_parameters):
    '''
    Function will update parameter context 
    '''
    update_pr = requests.post("http://localhost:8096/nifi-api/parameter-contexts/{}/update-requests".format(nifi_parameters['id']),json=nifi_parameters)
    if update_pr.status_code == 200:
        return update_pr
    else:
        logging.error("Error updating  parameter context details")
        return  {"Error":"Failed to update parameter context ","error":update_pr.json()}


def update_parameter_context(parameter_name,jolt_spec):
    """
    Function will update the paramters into NiFi 
    """
    # Get parameter context details
    pc = get_parameter_context('infra_parameters')
    
    # create parameter
    par_data = parameter_list_builder(parameter_name,jolt_spec)
    par_data['revision']['version'] = pc['version']
    par_data['id'] = pc['id']
    par_data['component']['id'] = pc['id']
    par_data['component']['name'] = pc['name']
    
    # update the parameter into NiFi
    up_status=update_parameters(par_data)
    if up_status.status_code == 200:
        logging.info("Successfully updated parameter")
    return par_data

if __name__ == "__main__":
    # 1
    # infra district jolt spec
    infra_district_table = jolt_spec.get_jolt_spec('Infra_jolt_district_table')
    infra_district_map = jolt_spec.get_jolt_spec('Infra_jolt_district_map')
    
    # update infra district jolt spec parameters
    update_parameter_context('infra_district_table',infra_district_table)
    update_parameter_context('infra_district_map',infra_district_map)
    print("Successfully updated district wise  dynamic Jolt spec for infrastructure reports")
    
    # 2
    # infra block jolt spec
    infra_block_table = jolt_spec.get_jolt_spec('Infra_jolt_block_table')
    infra_block_map = jolt_spec.get_jolt_spec('Infra_jolt_block_map')
    
    # update infra block jolt spec parameters
    update_parameter_context('infra_block_table',infra_block_table)
    update_parameter_context('infra_block_map',infra_block_map)
    print("Successfully updated block wise  dynamic Jolt spec for infrastructure reports")

    # 3
    # infra cluster jolt spec
    infra_cluster_table = jolt_spec.get_jolt_spec('Infra_jolt_cluster_table')
    infra_cluster_map = jolt_spec.get_jolt_spec('Infra_jolt_cluster_map')
    
    # update infra cluster jolt spec parameters
    update_parameter_context('infra_cluster_table',infra_cluster_table)
    update_parameter_context('infra_cluster_map',infra_cluster_map)
    print("Successfully updated cluster wise  dynamic Jolt spec for infrastructure reports")
    
    # 4
    # infra school jolt spec
    infra_school_table = jolt_spec.get_jolt_spec('Infra_jolt_school_table')
    infra_school_map = jolt_spec.get_jolt_spec('Infra_jolt_school_map')
    
    # update infra school jolt spec parameters
    update_parameter_context('infra_school_table',infra_school_table)
    update_parameter_context('infra_school_map',infra_school_map)
    print("Successfully updated school wise  dynamic Jolt spec for infrastructure reports")
    print("Successfully updated all the dynamic Jolt spec for infrastructure reports!!")


    
     