from client import *

def get_infra_weights():
    """Get the current infrastructure weights, infrastructure_score.csv file"""
    access_token=get_access_token(emission_url,headers,payload)
    infra_headers={"Authorization":"Bearer {}".format(access_token.get('access_token'))}
    infra_score=requests.get(emission_url+'infra_score',headers=infra_headers)
    if infra_score.status_code==200:
        with open('infrastructure_score.csv','wb') as fd:
            fd.write(infra_score.content)
    else:
        logging.error("failed to download the infrastructure score",infra_score.text)

if __name__=="__main__":
    get_infra_weights()
