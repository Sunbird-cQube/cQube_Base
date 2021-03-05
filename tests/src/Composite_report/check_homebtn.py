from selenium.webdriver.support.select import Select
from Data.parameters import Data
from reuse_func import GetData


class Homebutton_icon():
   def __init__(self,driver):
       self.driver = driver

   def test_homeicon(self):
       self.p =GetData()
       self.driver.implicitly_wait(20)
       self.driver.find_element_by_xpath(Data.hyper).click()
       self.p.page_loading(self.driver)
       dist = Select(self.driver.find_element_by_name("myDistrict"))
       dist.select_by_index(1)
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id(Data.homeicon).click()
       self.p.page_loading(self.driver)

   def test_homebutton(self):
       self.p = GetData()
       count = 0
       self.driver.implicitly_wait(20)
       self.driver.find_element_by_xpath(Data.hyper).click()
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id('homeBtn').click()
       self.p.page_loading(self.driver)
       if 'dashboard' in self.driver.current_url:
           print("home button is working fine , landing page is displayed ")
       else:
           print("Landing page is not displayed due to homebutton click not happened")
           count = count + 1
       self.p.navigate_to_composite_report()
       self.p.page_loading(self.driver)
       return count