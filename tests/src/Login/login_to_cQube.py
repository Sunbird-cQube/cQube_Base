from reuse_func import GetData


class cQube_login():
    def __init__(self,driver):
        self.driver = driver

    def test_login_to_cQube(self):
        self.data = GetData()
        count = 0
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print('login to cQube is successfull ')
        else:
            print('Login to cQube is failed ')
            count = count + 1
        return count