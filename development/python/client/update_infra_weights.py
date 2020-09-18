from client import *

def update_infra_score():
    """Update the infrastructure_score.csv file with approriate weights and call the below endpoint to change the infrastructure weights."""
    access_token=get_access_token(emission_url,headers,payload)
    infra_headers={"Authorization":"Bearer {}".format(access_token.get('access_token'))}
    files = [   ('file', open('infrastructure_score.csv','rb')) ]
    update_score_resp=requests.post(emission_url+'infra_weights', headers=infra_headers, files = files)
    if update_score_resp.status_code==200:
        logging.info("Updated the infrastructure weights {}".format(update_score_resp.text))
    else:
        logging.error("failed to update the infrastructure weights {}".format(update_score_resp.text))

if __name__=="__main__":
    update_infra_score()
