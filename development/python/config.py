from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from logging import FileHandler
import logging
from env import *

#File upload configuration
app = Flask(__name__)
app.secret_key = "secret key"

#Log level settings
#error log configuration
file_handler=FileHandler('error.log')
file_handler.setLevel(logging.ERROR)
app.logger.addHandler(file_handler)

#access log configuration
logger=logging.getLogger('werkzeug')
access_handler=FileHandler('access.log')
access_handler.setLevel(logging.INFO)
logger.addHandler(access_handler)
app.logger.addHandler(access_handler)

#Database connectivity
app.config['SQLALCHEMY_ECHO'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#debug settings
app.debug=False

db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
