from logging import FileHandler
import logging
from env import *

#Log level settings
#error log configuration
file_handler=FileHandler('error.log')
file_handler.setLevel(logging.ERROR)

#access log configuration
logger=logging.getLogger('werkzeug')
access_handler=FileHandler('access.log')
access_handler.setLevel(logging.INFO)
logger.addHandler(access_handler)
