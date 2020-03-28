import json
import os
import urllib
import numpy as np
from flask import Blueprint, current_app, jsonify, render_template

from app.config import Config
from app import cache

bp = Blueprint("core", __name__)

@bp.route("/", methods=["GET"])
@cache.cached(timeout=50)
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
    origins = ["ss1", "ss2", "ss3", "ss4", "ss5", "greek", "zodiac", "event", "raid", "ob"]

    pets = {}

    for origin in origins:
        url = os.path.join(Config.API_URL, f"priority/{origin}")
        response = urllib.request.urlopen(url)
        data = json.loads(response.read())
        pets[origin] = data["data"][0]["pets"]

    return render_template("pets_others.html", title="Other Pets", pets=pets)


@bp.route("/units/", methods=["GET"])
@cache.cached(timeout=50)
def units():
    units_by_tribe = []

    for tribe in range(4):
        url = os.path.join(Config.API_URL, f"units/tribe/{tribe}")
        response = urllib.request.urlopen(url)
        data = json.loads(response.read())
        units_tribe = data["data"]
        units_tribe_seven_star = [
            unit
            for unit in units_tribe
            if unit["stars"] == 7 and unit["evolveGem"] == -1
        ]
        units_tribe_six_star = [
            unit
            for unit in units_tribe
            if unit["stars"] == 6 and unit["evolveGem"] == -1
        ]
        units_tribe_five_star = [
            unit
            for unit in units_tribe
            if unit["stars"] == 5 and unit["evolveGem"] == 2800
        ]
        units_tribe_six_star.sort(key=lambda d: d["rotation"], reverse=True)
        units_tribe_five_star.sort(key=lambda d: d["rotation"], reverse=True)
        units_by_tribe.append(
            (
                units_tribe_seven_star,
                list(zip(units_tribe_six_star, units_tribe_five_star)),
            )
        )

    return render_template("units.html", title="Units", units_by_tribe=units_by_tribe)


@bp.route("/tickets/", methods=["GET"])
@cache.cached(timeout=50)
def tickets():
    url = os.path.join(Config.API_URL, "tickets")
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    tickets = data["data"]
    return render_template("tickets.html", title="Tickets", tickets=tickets)


@bp.route("/meta_progression/", methods=["GET"])
@cache.cached(timeout=50)
def meta_progression():
    return render_template("meta_progression.html")
