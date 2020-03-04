import json
import os

from flask import url_for

from app import create_app

app, freezer, pages, _ = create_app()

"""
@freezer.register_generator
def get_pet():
    pets_url = os.path.join(app.root_path, "static/json", "pets.json")
    pets = json.load(open(pets_url))
    for pet in pets.keys():
        yield url_for("core.get_pet", petid=pet.replace(" ", "_"))


@freezer.register_generator
def get_unit():
    units_url = os.path.join(app.root_path, "static/json", "units.json")
    units = json.load(open(units_url))
    for unit in units.keys():
        yield url_for("core.get_unit", unitid=unit.replace(" ", "_"))
"""