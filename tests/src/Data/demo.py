import unittest
from datetime import date

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData

#
# class cQube_Student_Attendance_exception(unittest.TestCase):
#
#     @classmethod
#     def setUpClass(self):
#         self.data = GetData()
#         self.driver = self.data.get_driver()
#         self.data.open_cqube_appln(self.driver)
#         self.data.login_cqube(self.driver)
#         self.data.navigate_to_student_exception()
#         self.data.page_loading(self.driver)
#
#     def test_demo_month_year(self):
#         self.data.page_loading(self.driver)
#         times = Select(self.driver.find_element_by_id('period'))
#         times.select_by_visible_text(' Year and Month ')
#         self.data.page_loading(self.driver)
#         year = Select(self.driver.find_element_by_id(Data.sar_year))
#         month = Select(self.driver.find_element_by_id(Data.sar_month))
#         self.year = (year.first_selected_option.text).strip()
#         self.month= (month.first_selected_option.text).strip()
#         self.data.page_loading(self.driver)
#         print(self.year,self.month)
#
#
#
#
#
#     @classmethod
#     def tearDownClass(cls):
#         cls.driver.close()
# today = date.today()
# todaydate = today. strftime('%d-%m-%Y')
# print(todaydate)

# value = '1: 2425040001'
# csv2 = '2: 242504002'
# value = '32: 2407'
value="1: 2425060001"
value = value[3:].strip()
print(value)

s = "Chetan"
print(s.lower())