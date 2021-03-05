from Data.parameters import Data
from reuse_func import GetData

class Logout_function():
   def __init__(self,driver):
       self.driver = driver
   def test_logout(self):
       self.p = GetData()
       self.driver.implicitly_wait(20)
       self.driver.find_element_by_xpath(Data.hyper).click()
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id(Data.logout).click()
       self.p.page_loading(self.driver)
       if "Log in to cQube" in self.driver.title:
           print("login page is displayed")
       else:
           print("logout is not working")
       data  = GetData()
       data.login_cqube(self.driver)
       self.p.page_loading(self.driver)
       data.navigate_to_crc_report()


