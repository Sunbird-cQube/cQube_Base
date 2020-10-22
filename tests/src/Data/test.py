

#
# path ="/home/chetan/Downloads/District_wise_report.csv"
#
file = open()
read = file.read()
if  'districtId' and 'districtName' in read:
    print( "user visited and total views records is present")
else:
    print('Not present')



import time
import unittest

from Data.parameters import Data
from reuse_func import GetData

class cQube_Home(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)

    # def test_dashboardviewes(self):
    #     time.sleep(6)
    #     self.data.page_loading(self.driver)
    #     views = self.driver.find_elements_by_tag_name('p')
    #     for i in range(len(views)):
    #         print(views[i].text)
    #     self.data.page_loading(self.driver)
    #     self.data.page_loading(self.driver)
    #     time.sleep(6)
    #     views = self.driver.find_elements_by_tag_name('p')
    #     for i in range(len(views)):
    #         print(views[i].text)
    #     self.data.page_loading(self.driver)
    #     self.data.page_loading(self.driver)
    #     time.sleep(6)
    #     views = self.driver.find_elements_by_tag_name('p')
    #     for i in range(len(views)):
    #         print(views[i].text)
    #     self.data.page_loading(self.driver)

    # def test_2dashboardviewes(self):
    #     self.data.page_loading(self.driver)
    #     time.sleep(5)
    #     views = self.driver.find_elements_by_tag_name('p')
    #     for i in range(len(views)):
    #         print(views[i].text)
    #     self.data.page_loading(self.driver)
    #
    # def test_3dashboardviewes(self):
    #     self.data.page_loading(self.driver)
    #     time.sleep(8)
    #     views = self.driver.find_elements_by_tag_name('p')
    #     for i in range(len(views)):
    #         print(views[i].text)
    #     self.data.page_loading(self.driver)


    def test_view_checking(self):
            text = self.driver.find_element_by_xpath(Data.infra_location).text
            print('Infrastructure access by Location',text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.infra_location).text
            print('Infrastructure access by Location',text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.infra_location).text
            print('Infrastructure access by Location',text)

            text = self.driver.find_element_by_xpath(Data.view_composite).text
            print('Composite report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_composite).text
            print('Composite report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_composite).text
            print('Composite report', text)

            text = self.driver.find_element_by_xpath(Data.view_udise).text
            print('Udise report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_udise).text
            print('Udise report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_udise).text
            print('Udise report', text)

            text = self.driver.find_element_by_xpath(Data.view_compo).text
            print('Composite metrics report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_compo).text
            print('Composite metrics report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_compo).text
            print('Composite metrics report', text)

            text = self.driver.find_element_by_xpath(Data.view_profile).text
            print('Diksha user profile report', text)
            time.sleep(8)
            text = self.driver.find_element_by_xpath(Data.view_profile).text
            print('Diksha user profile report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_profile).text
            print('Diksha user profile report', text)

            text = self.driver.find_element_by_xpath(Data.view_location).text
            print('Diksha user location report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_location).text
            print('Diksha user location report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_location).text
            print('Diksha user location report', text)

            text = self.driver.find_element_by_xpath(Data.view_content).text
            print('Diksha user content report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_content).text
            print('Diksha user content report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_content).text
            print('Diksha user content report', text)

            text = self.driver.find_element_by_xpath(Data.view_crc).text
            print('crc report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_crc).text
            print('crc report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_crc).text
            print('crc report', text)


            text = self.driver.find_element_by_xpath(Data.view_semester).text
            print('semester report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_semester).text
            print('semester report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_semester).text
            print('semester report', text)

            text = self.driver.find_element_by_xpath(Data.view_pat).text
            print('Periodic report', text)
            time.sleep(8)
            text = self.driver.find_element_by_xpath(Data.view_pat).text
            print('Periodic report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_pat).text
            print('Periodic report', text)

            text = self.driver.find_element_by_xpath(Data.view_exception).text
            print('semester exception report', text)
            time.sleep(8)
            text = self.driver.find_element_by_xpath(Data.view_exception).text
            print('semester exception report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_exception).text
            print('semester exception report', text)

            text = self.driver.find_element_by_xpath(Data.view_completion).text
            print('Download exception list :', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_completion).text
            print('Download exception list :', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_completion).text
            print('Download exception list :', text)


            text = self.driver.find_element_by_xpath(Data.view_student).text
            print('Student attendance report: ', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_student).text
            print('Student attendance report: ', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_student).text
            print('Student attendance report: ', text)


            text = self.driver.find_element_by_xpath(Data.view_teacher).text
            print('Teacher report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_teacher).text
            print('Teacher report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_teacher).text
            print('Teacher report', text)


            text = self.driver.find_element_by_xpath(Data.view_telemetry).text
            print('Telemetry report', text)
            time.sleep(10)
            text = self.driver.find_element_by_xpath(Data.view_telemetry).text
            print('Telemetry report', text)
            time.sleep(12)
            text = self.driver.find_element_by_xpath(Data.view_telemetry).text
            print('Telemetry report', text)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()