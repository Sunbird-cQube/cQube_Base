from update_nifi_parameters_main import *
import time
import ast

def update_parameter_ctx(pc_var, parameter_name, jolt_spec):
    """
    Function will update the paramters into NiFi
    """
    # Get parameter context details
    pc = get_parameter_context(pc_var)

    # create parameter
    par_data = parameter_list_builder(parameter_name, jolt_spec)
    par_data['revision']['version'] = pc['version']
    par_data['id'] = pc['id']
    par_data['component']['id'] = pc['id']
    par_data['component']['name'] = pc['name']

    # update the parameter into NiFi
    up_status = update_parameters(par_data)
    if up_status.status_code == 200:
        logging.info("Successfully updated parameter")
    return par_data

def nifi_params_config():
    params={
        'cQube-raw-data-fetch-parameters':'diksha_progress_exhaust_batch_list.json'
        
    }
    for param_name,filename in params.items():
        with open(filename,'r') as fd:
            parameter_data=fd.read()
        parameter_dict=ast.literal_eval(parameter_data)
        for parameter_name, value in parameter_dict.items():
            time.sleep(1)
            update_parameter_ctx(param_name, parameter_name, value)

if __name__=="__main__":
    nifi_params_config()

