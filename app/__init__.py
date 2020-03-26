import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_bootstrap import Bootstrap
from flask_flatpages import FlatPages
from flask_frozen import Freezer
from flask_jsglue import JSGlue
from flask_caching import Cache

from app.config import Config

bootstrap = Bootstrap()
cache = Cache(config={"CACHE_TYPE": "simple"})


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    pages = FlatPages(app)
    freezer = Freezer(app)
    jsglue = JSGlue(app)
    bootstrap.init_app(app)
    cache.init_app(app)

    from app.core.routes import bp as core_bp

    app.register_blueprint(core_bp)

    if not app.debug:
        if not os.path.exists("logs"):
            os.mkdir("logs")
        file_handler = RotatingFileHandler(
            "logs/endless_farming.log", maxBytes=10240, backupCount=10
        )
        file_handler.setFormatter(
            logging.Formatter(
                "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
            )
        )
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info("Endless farming startup")

    return app, freezer, pages, jsglue
