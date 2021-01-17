import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from reuse_func import GetData


class levels_dropdown():

    def __init__(self,driver):
        self.driver = driver

    def check_level_options(self):
        self.data = GetData()
        levels =Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        count = len(levels.options)-1
        for i in range(1,(len(levels.options))):
            levels.select_by_index(i)
            print(levels.options[i].text)
            self.data.page_loading(self.driver)
        return count

    def click_on_submit_without_entering_level_and_id(self):
        self.data = GetData()
        count = 0
        # self.driver.find_element_by_id(Data.submit).click()
        self.data.page_loading(self.driver)
        self.driver.refresh()
        self.data.page_loading(self.driver)
        # if 'Please choose level and enter the id/name' in self.driver.page_source:
        #     print('Error message should be displayed')
        # else:
        #     print("Please choose level and enter the id/name is not displayed")
        #     count = count + 1
        # return count

    def select_levels_click_on_submit_btn(self):
        self.data = GetData()
        count = 0
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_index(2)
        self.data.page_loading(self.driver)
        # self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        self.driver.refresh()
        # if 'Please enter valid id/name' == self.driver.page_source:
        #     print("Error message is displayed")
        # else:
        #     print("Please Enter the id/name is not displayed on screen")
        #     count = count + 1
        # return count

    def select_level_as_Districts_text(self):
        self.data = GetData()
        count = 0
        dnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dnames.health_card_d1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        actual_name = self.driver.find_element_by_xpath(Data.District_name).text
        expected_name= dnames.health_card_d1_name()
        if actual_name == expected_name:
            print(expected_name,"is displayed in health cards ")
        else:
            print('Passed input records are not displayed in health cards ')
            count = count + 1
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count


    def select_level_as_Blocks_text(self):
        self.data = GetData()
        count = 0
        bnames = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(bnames.health_card_b1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        actual_name = self.driver.find_element_by_xpath(Data.Block_name).text
        expected_name = bnames.health_card_b1_name()
        if actual_name == expected_name:
            print(expected_name, "is displayed in health cards ")
        else:
            print('Passed input records are not displayed in health cards ')
            count = count + 1
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count


    def select_level_as_Clusters_text(self):
        self.data = GetData()
        count = 0
        cnames = file_extention()
        self.data.page_loading(self.driver)
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(cnames.health_card_c1_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        actual_name = self.driver.find_element_by_xpath(Data.Cluster_name).text
        expected_name = cnames.health_card_c1_name()
        self.data.page_loading(self.driver)
        if actual_name == expected_name:
            print(expected_name, "is displayed in health cards ")
        else:
            print(actual_name,expected_name,'Passed input records are not displayed in health cards ')
            count = count + 1
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count

    def select_level_as_School_text(self):
        self.data = GetData()
        count = 0
        snames= file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(snames.health_card_S2_name())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        time.sleep(3)
        actual_name = self.driver.find_element_by_xpath(Data.School_name).text
        expected_name = snames.health_card_S2_name()
        self.data.page_loading(self.driver)
        if actual_name == expected_name:
            print(expected_name, "is displayed in health cards ")
        else:
            print(actual_name,expected_name,'Passed input records are not displayed in health cards ')
            count = count + 1
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count

    def select_level_as_Districts_id(self):
        self.data = GetData()
        count = 0
        dids = file_extention()
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" District ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.search).send_keys(dids.health_card_d1_id())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        if dids.health_card_d1_id() in self.driver.page_source:
            print(dids.health_card_d1_id(), "is displayed in health cards ")
        else:
            print('Passed input records are not displayed in health cards ')
            count = count + 1
        itags = self.driver.find_elements_by_xpath("//div[@id='div3']/div/span")
        for i in range(len(itags)):
            print(itags[i].text)
            self.data.page_loading(self.driver)
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count

    def select_level_as_Blocks_id(self):
        self.data = GetData()
        count = 0
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Block ")
        self.data.page_loading(self.driver)
        bids = file_extention()
        self.driver.find_element_by_id(Data.search).send_keys(bids.health_card_b1_id())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        if bids.health_card_b1_id() in self.driver.page_source:
            print(bids.health_card_b1_id(), "is displayed in health cards ")
        else:
            print('Passed input records are not displayed in health cards ')
            count = count + 1
        self.data.page_loading(self.driver)
        itags = self.driver.find_elements_by_xpath("//div[@id='div3']/div/span")
        for i in range(len(itags)):
            print(itags[i].text)
            self.data.page_loading(self.driver)
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count

    def select_level_as_Clusters_id(self):
        self.data = GetData()
        count = 0
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" Cluster ")
        self.data.page_loading(self.driver)
        cids = file_extention()
        self.driver.find_element_by_id(Data.search).send_keys(cids.health_card_c1_id())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        if cids.health_card_c1_id() in self.driver.page_source:
            print(cids.health_card_c1_id(), "is displayed in health cards ")
        else:
            print('Passed input records are not displayed in health cards ')
            count = count + 1
        itags = self.driver.find_elements_by_xpath("//div[@id='div3']/div/span")
        for i in range(len(itags)):
            print(itags[i].text)
            self.data.page_loading(self.driver)
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count

    def select_level_as_School_id(self):
        self.data = GetData()
        count = 0
        levels = Select(self.driver.find_element_by_id(Data.levels))
        self.data.page_loading(self.driver)
        levels.select_by_visible_text(" School ")
        self.data.page_loading(self.driver)
        sids = file_extention()
        self.driver.find_element_by_id(Data.search).send_keys(sids.health_card_S1_id())
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.submt).click()
        self.data.page_loading(self.driver)
        if sids.health_card_S1_id() in self.driver.page_source:
            print(sids.health_card_S1_id(), "is displayed in health cards ")
        else:
            print('Passed input records are not displayed in health cards ')
            count = count + 1
        itags = self.driver.find_elements_by_xpath("//div[@id='div3']/div/span")
        for i in range(len(itags)):
            print(itags[i].text)
            self.data.page_loading(self.driver)
        self.driver.refresh()
        self.data.page_loading(self.driver)
        return count


