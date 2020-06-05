import configparser

import requests

from get_dir import pwd
p=pwd()
config = configparser.ConfigParser()
config.read('/home/devraj/PycharmProjects/CqubeMetric/crc.ini')
class crc_get_data():
    def __init__(self):
        self.lurl = config['url']['domain']+'roleBasedLogin'
        self.crc_dist_url = config['url']['domain']+'crc/districtWise'
        self.crc_block_url = config['url']['domain']+'crc/allBlockWise'
        self.crc_cluster_url = config['url']['domain']+'crc/allClusterWise'
        self.crc_school_url = config['url']['domain']+'crc/allSchoolWise'
        self.payload={"email":config['url']['email'],"cnfpass":config['url']['password']}


    def cqube_login(self,lurl,payload):
        resp=requests.post(lurl,data=payload,timeout=60)
        if resp.status_code==200:
            access_token=resp.json()['token']
            return access_token

    def dist_wise_crc(self,crc_url):
        access_token = self.cqube_login(self.lurl,self.payload)
        headers = {"token": "Bearer "+access_token}
        dist_data=requests.post(crc_url,headers=headers,timeout=60)
        return  dist_data.json()


# crc_dist_df=pd.DataFrame.from_records(dist_wise_crc(crc_dist_url)['visits'])
# crc_block_df=pd.DataFrame.from_records(dist_wise_crc(crc_block_url)['visits'])
# crc_cluster_df=pd.DataFrame.from_records(dist_wise_crc(crc_cluster_url)['visits'])
# crc_school_df=pd.DataFrame.from_records(dist_wise_crc(crc_school_url)['visits'])
