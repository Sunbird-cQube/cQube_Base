import re
import time

from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from Data.parameters import Data


class ClusterDotsWithNoOfSchools():
    def __init__(self, driver):
        self.driver = driver

    def comapre_cluster(self):
        self.driver.find_element_by_css_selector('p >span').click()
        time.sleep(5)
        select_district=WebDriverWait(self.driver, 30).until(EC.element_located_to_be_selected((By.ID, 'choose_dist')))
        select_block=WebDriverWait(self.driver, 30).until(EC.element_located_to_be_selected((By.ID, 'choose_block')))
        select_cluster=WebDriverWait(self.driver, 30).until(EC.element_located_to_be_selected((By.ID, 'choose_cluster')))
        select_district = Select(select_district)
        select_block = Select(select_block)
        select_cluster = Select(select_cluster)
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            for y in range(len(select_block.options) - 1, len(select_block.options)):
                select_block.select_by_index(y)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    list = self.driver.find_elements_by_class_name(Data.dots)
                    elem = self.driver.find_element_by_id(Data.schoolcount).text
                    res = re.sub("\D", "", elem)
                    if int(len(list) - 1) != int(res):
                        count = count + 1
                        print(
                            "no of schools and number of dots are mis matched at" + " " + select_district.first_selected_option.text + " " + select_block.first_selected_option.text + " " + select_cluster.first_selected_option.text)
        return count
