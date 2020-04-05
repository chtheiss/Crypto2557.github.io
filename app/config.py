import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or "you-will-never-guess"

    ADMINS = ["endlessfarmingtracker@gmail.com"]
    API_URL = "https://endless-farming-backend.herokuapp.com/api/v1/"
