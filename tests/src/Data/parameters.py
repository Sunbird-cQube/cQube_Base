import base64
import os
import time

class Data():

    def get_driver_path(self):
        os.chdir('../')
        executable_path = os.path.join(os.getcwd(), 'Driver/geckodriver')
        return executable_path

    def get_system_path(self):
        os.chdir('../')
        pwd = os.getcwd()
        return pwd

    def get_report_path(self):
        os.chdir('../')
        os.getcwd()
        report_path = os.path.join(os.getcwd(), 'cQube-New/Reports/report.html')
        return report_path

    def get_file(self):
        os.chdir('../')
        os.getcwd()
        file_path = os.path.join(os.getcwd(),'cQube-New/Data_file/')
        return  file_path

    value1 ="Ahmedabad"

    logout ="/html/body/app-root/app-home/mat-toolbar/button[2]/span"
    url ="url"
    username = base64.b64decode("username").decode("utf-8")
    password = base64.b64decode("password").decode("utf-8")

    email = "//input[@id='exampleInputEmail']"
    pwd = "//input[@id='exampleInputPassword']"
    loginbtn = "//button[@type='submit']"

    Blocks = "//button[@class='btn btn-secondary']/b[contains(text(),'Blocks')]"
    Clusters = "//button[@class='btn btn-secondary']/b[contains(text(),'Clusters')]"
    Schools = "//button[@class='btn btn-secondary']/b[contains(text(),'Schools')]"

    dots = "leaflet-interactive"
    SAR_Details ="//div[@class='row']/div[@class='col-sm-4']/span"
    hyper_link = "//p/span"
    directory = "//p[contains(text(),' Semester report for:')]/span"
    Download = "//img[@title='Download Report']"

    # Dash board
    Dashboard = "//span[@class='mat-button-wrapper']/mat-icon"
    login_in = "//span[@class='span']"
    SAR = "//div[@class='mat-list-item-content']/td[contains(text(),'Student')]"
    Log_out = "//button/span[contains(text(),'Log Out')]"
    Home_icon = "home"
    select_district = 'myDistrict'
    select_blocks = 'myBlock'
    select_clusters = 'myCluster'
    select_month = 'month'
    select_year = 'year'

    select_sem_district = '/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]'
    select_sem_blocks = '/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]'
    select_sem_clusters = '/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]'


    No_schools = '/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[4]/div[2]'

    No_sem_schools='/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[4]/div[2]'
    SR_Blocks_btn = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[1]/button[1]"
    SR_Clusters_btn = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[1]/button[2]"
    SR_Schools_btn = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[1]/button[3] "
    Download_icon = "//img[@alt='Download Report']"
    #user_creation
    user ="/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/mat-list/mat-list-item/div/button/span/mat-icon"
    create_user ="/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/mat-list/div/a[1]/div/span"
    create_headtext ="//h2"
    fname ="//input[@name='firstname']"
    mname ="//input[@name='middlename']"
    lname = "//input[@name='lastname']"
    male ="//input[@name='gender'][1]"
    female ="//input[@name='gender'][2]"
    mail ="//input[@name='email']"
    designation ="//input[@name='Designation']"
    confpass ="//input[@name='cnfpass']"
    rolesoptions ="//select/option"
    admin ="//select/option[2]"
    drc = "//select/option[3]"
    drv = "//select/option[4]"
    Adoc = "//select/option[5]"
    Demission ="//select/option[6]"
    changepwd = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/mat-list/div/a[2]/div/span"
    new_pwd ="//input[@name='newPasswd']"
    conf_pwd ="//input[@name='cnfpass']"
    submit = "//button[@type='submit']"
    errormsg ="//p"

    # for SAR_2
    SAR_Blocks_btn = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[1]/button[1]"
    SAR_Clusters_btn = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[1]/button[2]"
    SAR_Schools_btn = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[1]/button[3] "

    # Footer info
    no_schools = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[4]/div[2]/span"
    no_students = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[4]/div[1]/span"
    zoom_in = "//a[@title='Zoom in']"
    zoom_out = "//a[@title='Zoom out']"
    dash_name = "//h4"
    # list of names
    Dnames = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option"
    Bnames = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option"
    cnames = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option"

    crcdist ="/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option"

    year = "//select[@id='year']/option[1]"
    monthnames = "//select[@id='month']/option"
    august = "//select[@id='month']/option[contains(text(),'August')]"
    Sept = "//select[@id='month']/option[contains(text(),' September')]"
    Oct = "//select[@id='month']/option[contains(text(),' October_wise ')]"
    blockslist = "//select[@name='myBlock']/option"
    clusterlist = "//select[@name='myCluster']/option"
    back = "//a"
    reg_user = "//a"
    details = "//div[@class='col-sm-4']/span"
    # Dash board
    TAR = "//div[@class='mat-list-item-content']/td[contains(text(),'Teacher')]"
    SR = "//div[@class='mat-list-item-content']/td[contains(text(),'Semester')]"
    crc = "//div[@class='mat-list-item-content']/td[contains(text(),'CRC Report')]"
    students = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[4]/div[1]/span"
    schoolcount = " /html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[4]/div[2]/span"
    DateRange = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[4]/div[3]/span"

    # xpath of Dashboard

    crcvisits = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[5]/div[1]/span"
    totalschools = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[5]/div[2]/span"

    visited = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[5]/div[3]/span"
    notvisited = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[5]/div[4]/span"

    range = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[5]/div[5]/span"

    # Table in CRC

    # rowby data
    distrows = "//tr[@class='odd']/td"
    headers = "//tr[@role='row']/th"
    footer = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[5]/div/span"

    # select_type
    distwise = "//select[@name='downloadType']/option[2]"
    blkwise = "//select[@name='downloadType']/option[3]"
    clusterwise = "//select[@name='downloadType']/option[4]"
    schoolwise = "//select[@name='downloadType']/option[5]"
    # X axis and Y axis
    xaxis = "//select[@name='xAxis']/option"
    yaxis = "//select[@name='yAxis']/option"

    crcdistrict = "//select[@name='myDistrict']/option"
    selecttype = "//*[@id='select']/select/option"

    Notemsg = "//div[@class='col-sm-12']/p/b"
    value2 = "Anand"
    # semester Report
    srDist = "//select[@class='ng-untouched ng-pristine ng-valid']/option"
    srcluster = "//select[@class='ng-pristine ng-valid ng-touched']/option"
    srblock = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option"

    # semester
    SRD1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[2]"
    SRD2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[3]"
    SRD3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[4]"
    SRD4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[5]"
    SRD5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[6]"
    SRD6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[7]"
    SRD7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[8]"
    SRD8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[9]"
    SRD9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[10]"
    SRD10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[11]"
    SRD11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[12]"
    SRD12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[13]"
    SRD13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[14]"
    SRD14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[15]"
    SRD15 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[16]"
    SRD16 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[17]"
    SRD17 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[18]"
    SRD18 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[19]"
    SRD19 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[20]"
    SRD20 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[21]"
    SRD21 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[22]"
    SRD22 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[23]"
    SRD23 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[24]"
    SRD24 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[25]"
    SRD25 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[26]"
    SRD26 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[27]"
    SRD27 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[28]"
    SRD28 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[29]"
    SRD29 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[30]"
    SRD30 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[31]"
    SRD31 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[32]"
    SRD32 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[33]"
    SRD33 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[1]/option[34]"

    SRB1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[2]"
    SRB2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[3]"
    SRB3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[4]"
    SRB4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[5]"
    SRB5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[6]"
    SRB6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[7]"
    SRB7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[8]"
    SRB8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[9]"
    SRB9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[10]"
    SRB10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[11]"
    SRB11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[12]"
    SRB12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[13]"
    SRB13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[14]"
    SRB14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[2]/option[15]"

    SRC1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[2]"
    SRC2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[3]"
    SRC3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[4]"
    SRC4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[5]"
    SRC5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[6]"
    SRC6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[7]"
    SRC7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[8]"
    SRC8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[9]"
    SRC9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[10]"
    SRC10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[11]"
    SRC11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[12]"
    SRC12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[13]"
    SRC13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[14]"
    SRC14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[15]"
    SRC15 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[16]"
    SRC16 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[17]"
    SRC17 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[18]"
    SRC18 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[19]"
    SRC19 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[20]"
    SRC20 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[21]"
    SRC21 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[22]"
    SRC22 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[23]"
    SRC23 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[24]"
    SRC24 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[25]"
    SRC25 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[2]/div[2]/select[3]/option[26]"

    # Student Attedance Reports
    SARD1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[2]"
    SARD2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[3]"
    SARD3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[4]"
    SARD4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[5]"
    SARD5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[6]"
    SARD6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[7]"
    SARD7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[8]"
    SARD8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[9]"
    SARD9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[10]"
    SARD10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[11]"
    SARD11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[12]"
    SARD12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[13]"
    SARD13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[14]"
    SARD14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[15]"
    SARD15 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[16]"
    SARD16 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[17]"
    SARD17 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[18]"
    SARD18 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[19]"
    SARD19 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[20]"
    SARD20 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[21]"
    SARD21 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[22]"
    SARD22 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[23]"
    SARD23 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[24]"
    SARD24 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[25]"
    SARD25 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[26]"
    SARD26 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[27]"
    SARD27 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[28]"
    SARD28 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[29]"
    SARD29 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[30]"
    SARD30 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[31]"
    SARD31 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[32]"
    SARD32 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[33]"
    SARD33 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[1]/option[34]"

    SARB1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[2]"
    SARB2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[3]"
    SARB3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[4]"
    SARB4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[5]"
    SARB5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[6]"
    SARB6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[7]"
    SARB7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[8]"
    SARB8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[9]"
    SARB9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[10]"
    SARB10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[11]"
    SARB11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[12]"
    SARB12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[13]"
    SARB13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[14]"
    SARB14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[2]/option[15]"

    SARC1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[2]"
    SARC2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[3]"
    SARC3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[4]"
    SARC4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[5]"
    SARC5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[6]"
    SARC6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[7]"
    SARC7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[8]"
    SARC8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[9]"
    SARC9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[10]"
    SARC10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[11]"
    SARC11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[12]"
    SARC12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[13]"
    SARC13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[14]"
    SARC14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[15]"
    SARC15 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[16]"
    SARC16 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[17]"
    SARC17 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[18]"
    SARC18 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[19]"
    SARC19 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[20]"
    SARC20 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[21]"
    SARC21 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[22]"
    SARC22 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[23]"
    SARC23 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[24]"
    SARC24 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[25]"
    SARC25 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-map-view/div/div[2]/div[2]/select[3]/option[26]"

   # CRC_Reports

    CRD1 = "//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[2]"
    CRD2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[3]"
    CRD3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[4]"
    CRD4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[5]"
    CRD5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[6]"
    CRD6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[7]"
    CRD7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[8]"
    CRD8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[9]"
    CRD9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[10]"
    CRD10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[11]"
    CRD11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[12]"
    CRD12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[13]"
    CRD13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[14]"
    CRD14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[15]"
    CRD15 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[16]"
    CRD16 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[17]"
    CRD17 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[18]"
    CRD18 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[19]"
    CRD19 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[20]"
    CRD20 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[21]"
    CRD21 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[22]"
    CRD22 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[23]"
    CRD23 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[24]"
    CRD24 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[25]"
    CRD25 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[26]"
    CRD26 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[27]"
    CRD27 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[28]"
    CRD28 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[29]"
    CRD29 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[30]"
    CRD30 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[31]"
    CRD31 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[32]"
    CRD32 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[1]/option[33]"
    CRD33 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-sem-view/div/div[3]/div[2]/select[1]/option[34]"

    CRB1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[2]"
    CRB2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[3]"
    CRB3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[4]"
    CRB4 = "//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[5]"
    CRB5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[6]"
    CRB6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[7]"
    CRB7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[8]"
    CRB8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[9]"
    CRB9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[10]"
    CRB10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[11]"
    CRB11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[12]"
    CRB12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[13]"
    CRB13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[14]"
    CRB14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[2]/option[15]"

    CRC1 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[2]"
    CRC2 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[3]"
    CRC3 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[4]"
    CRC4 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[5]"
    CRC5 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[6]"
    CRC6 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[7]"
    CRC7 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[8]"
    CRC8 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[9]"
    CRC9 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[10]"
    CRC10 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[11]"
    CRC11 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[12]"
    CRC12 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[13]"
    CRC13 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[14]"
    CRC14 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[15]"
    CRC15 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[16]"
    CRC16 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[17]"
    CRC17 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[18]"
    CRC18 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[19]"
    CRC19 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[20]"
    CRC20 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[21]"
    CRC21 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[22]"
    CRC22 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[23]"
    CRC23 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[24]"
    CRC24 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[25]"
    CRC25 = "/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-bar-chart/div/div[3]/div[2]/select[3]/option[26]"