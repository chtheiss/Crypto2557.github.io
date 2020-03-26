import json
import os
import urllib
import numpy as np
from flask import Blueprint, current_app, jsonify, render_template

from app.config import Config
from app import cache

bp = Blueprint("core", __name__)


def get_json(filename):
    absolute_filename = os.path.join(current_app.root_path, "static/json", filename)
    with open(absolute_filename) as file:
        return json.load(file)


@bp.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@bp.route("/pets/", methods=["GET"])
@cache.cached(timeout=50)
def pets():
    number_of_trackers = 12
    stages_per_two_kl = 10

    url = os.path.join(Config.API_URL, "priority/shn")
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    pets = data["data"][0]["pets"]
    for pet in pets:
        pet["KL"] = (
            (np.ceil(np.array(pet["stages"]) / stages_per_two_kl) * 2)
            .astype(int)
            .tolist()
        )

    return render_template(
        "pets.html", title="Pets", pets=pets, number_of_trackers=number_of_trackers
    )


@bp.route("/pets_hard/", methods=["GET"])
@cache.cached(timeout=50)
def pets_hard():
    number_of_trackers = 18

    url = os.path.join(Config.API_URL, "priority/shh")
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    pets = data["data"][0]["pets"]
    for pet in pets:
        pet["KL"] = (50 + (np.array(pet["stages"]) - 1) * 4).astype(int).tolist()

    return render_template(
        "pets_hard.html",
        title="Hard Pets",
        pets=pets,
        number_of_trackers=number_of_trackers,
    )


@bp.route("/pets_others/", methods=["GET"])
@cache.cached(timeout=50)
def pets_others():
    origins = ["ss1", "ss2", "ss3", "ss4", "ss5", "greek", "zodiac", "event"]

    pets = {}

    for origin in origins:
        url = os.path.join(Config.API_URL, f"priority/{origin}")
        response = urllib.request.urlopen(url)
        data = json.loads(response.read())
        pets[origin] = data["data"][0]["pets"]

    return render_template("pets_others.html", title="Other Pets", pets=pets)


@bp.route("/units/", methods=["GET", "POST"])
def units():
    units = get_json("units.json")
    pets = get_json("pets.json")

    number_of_rotations = 18

    max_buffs = [
        max(
            [
                len(unit["buffs"])
                for key, unit in units.items()
                if (unit["rotation"] == i)
            ]
        )
        for i in range(1, number_of_rotations + 1)
    ]
    max_buffs.reverse()
    max_buffs = np.repeat(
        np.array(max_buffs), [4 for _ in range(number_of_rotations)], axis=0
    )
    max_add_buffs = [
        max(
            [
                len(pets[unit["pet"]]["additional_buffs"])
                for key, unit in units.items()
                if (unit["rotation"] == i)
            ]
        )
        for i in range(1, number_of_rotations + 1)
    ]
    max_add_buffs.reverse()
    max_add_buffs = np.repeat(
        np.array(max_add_buffs), [4 for _ in range(number_of_rotations)], axis=0
    )
    return render_template(
        "units.html",
        title="Units",
        units=units,
        pets=pets,
        max_buffs=max_buffs,
        max_add_buffs=max_add_buffs,
    )


@bp.route("/tickets/", methods=["GET", "POST"])
@cache.cached(timeout=50)
def tickets():
    url = os.path.join(Config.API_URL, "tickets")
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    tickets = data["data"]
    print(tickets)
    return render_template("tickets.html", title="Tickets", tickets=tickets)


@bp.route("/meta_progression/", methods=["GET", "POST"])
@cache.cached(timeout=50)
def meta_progression():
    return render_template("meta_progression.html")


@bp.route("/static/json/pets/", methods=["GET", "POST"])
def get_pets():
    pets = get_json("pets.json")
    return jsonify(pets)


@bp.route("/static/json/units/", methods=["GET", "POST"])
def get_units():
    units = get_json("units.json")
    return jsonify(units)


@bp.route("/static/json/pet_priority.json", methods=["GET", "POST"])
def get_priority():
    pet_priority = get_json("pet_priority.json")
    return jsonify(priority=pet_priority)


@bp.route("/static/json/hard_sh_pet_priority.json", methods=["GET", "POST"])
def get_hard_sh_priority():
    pet_priority = get_json("hard_sh_pet_priority.json")
    return jsonify(priority=pet_priority)
