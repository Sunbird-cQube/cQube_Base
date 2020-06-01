import configparser
import requests

config = configparser.ConfigParser()
config.read('Nifi_Config.ini')


def get_nifi_root_pg():
    """
    Function will get the NIFI native processor group id
    :return NiFi root processor group details
    """
    nifi_root_pg_res = requests.get(
        url=config['NIFI']['IP'] + ':' + config['NIFI']['PORT'] + '/nifi-api/process-groups/root')
    assert nifi_root_pg_res.status_code is 200
    return nifi_root_pg_res


def get_processor_group():
    """
    :param processor_group_name
    :return: processor group details
    """
    nifi_root_pg = get_nifi_root_pg()

    if nifi_root_pg.status_code is 200:
        pg_res = requests.get(url=config['NIFI']['IP'] + ':' + config['NIFI']['PORT'] + '/nifi-api/flow/process-groups/'+nifi_root_pg.json()['component']['id'])
        assert pg_res.status_code is 200

        return pg_res
    else:
        return None


# TEST CASE 1
def test_pg_controllers_status():
    """
    Test whether all controllers are started
    """
    pg_id = get_processor_group()
    for value in pg_id.json()['processGroupFlow']['flow']['processGroups']:
        pg_id_n = value['component']['id']
        cid = requests.get(url=config['NIFI']['IP'] + ':' + config['NIFI']['PORT']+'/nifi-api/flow/process-groups/{}/controller-services'.format(pg_id_n))
        for ctr in cid.json()['controllerServices']:
            status = ctr['component']['state']
            assert status == 'ENABLED'


# TEST CASE 2
def test_pg_processors_status():
    """
    Test whether all processors are started
     """
    pg_id = get_processor_group()
    for value in pg_id.json()['processGroupFlow']['flow']['processGroups']:
        pg_id_n = value['component']['id']
        prc_res = requests.get(url=config['NIFI']['IP'] + ':' + config['NIFI']['PORT']+'/nifi-api/process-groups/{}/processors'.format(pg_id_n))
        for prc in prc_res.json()['processors']:
            status = prc['component']['state']
            assert status == 'STARTED'