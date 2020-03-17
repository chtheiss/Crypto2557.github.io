import json
import os

import numpy as np
from flask import Blueprint, current_app, jsonify, render_template

bp = Blueprint("core", __name__)


def get_json(filename):
    absolute_filename = os.path.join(current_app.root_path, "static/json", filename)
    with open(absolute_filename) as file:
        return json.load(file)


@bp.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@bp.route("/pets/", methods=["GET", "POST"])
def pets():
    pet_priority = get_json("pet_priority.json")
    pets = get_json("pets.json")

    stages_per_two_kl = 10
    number_of_trackers = 12
    for key, item in pet_priority.items():
        pets[item]["priority"] = key
        pets[item]["KL"] = (
            (np.ceil(np.array(pets[item]["from"]) / stages_per_two_kl) * 2)
            .astype(int)
            .tolist()
        )

    pets_ordered = json.loads(
        json.dumps(
            dict(
                [
                    (pet, pets[pet])
                    for pet in sorted(pets, key=lambda d: int(pets[d]["priority"]))
                ]
            )
        )
    )
    return render_template(
        "pets.html",
        title="Pets",
        pets=pets_ordered,
        ceil=np.ceil,
        number_of_trackers=number_of_trackers,
    )


@bp.route("/pets_others/", methods=["GET", "POST"])
def pets_others():
    origins = ["ss1", "ss2", "ss3", "ss4", "ss5", "greek", "zodiac", "event"]
    pets = get_json("other_pets.json")

    prioritites = {}
    for origin in origins:
        prioritites[origin] = get_json(f"other_pets_priorities/{origin}.json")

    for pet in pets:
        origin = pet["origin"][0]
        if origin != "raid" and origin != "ob":
            priority = prioritites[origin]
            pet["priority"] = list(priority.keys())[
                list(priority.values()).index(pet["name"])
            ]

    pets_by_origin = {}
    for origin in origins:
        pets_by_origin[origin] = sorted(
            list(filter(lambda x: origin in x["origin"], pets)),
            key=lambda pet: int(pet["priority"]),
        )
    return render_template("pets_others.html", title="Other Pets", pets=pets_by_origin)


@bp.route("/pets_hard/", methods=["GET", "POST"])
def pets_hard():
    pet_priority = get_json("hard_sh_pet_priority.json")
    pets = get_json("hard_sh_pets.json")

    number_of_trackers = 18

    for key, item in pet_priority.items():
        pets[item]["priority"] = key
        pets[item]["KL"] = (
            (50 + (np.array(pets[item]["from"]) - 1) * 4).astype(int).tolist()
        )

    pets_ordered = json.loads(
        json.dumps(
            dict(
                [
                    (pet, pets[pet])
                    for pet in sorted(pets, key=lambda d: int(pets[d]["priority"]))
                ]
            )
        )
    )
    return render_template(
        "pets_hard.html",
        title="Hard Pets",
        pets=pets_ordered,
        ceil=np.ceil,
        number_of_trackers=number_of_trackers,
    )


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
def tickets():
    units = get_json("units.json")
    tickets = get_json("ticket_order.json")
    return render_template(
        "tickets.html", title="Tickets", units=units, tickets=tickets
    )


@bp.route("/static/json/pets/<petid>.json", methods=["GET", "POST"])
def get_pet(petid):
    pets = get_json("pets.json")
    return jsonify({"petid": petid, "pet": pets[petid.replace("_", " ")]})


@bp.route("/static/json/units/<unitid>.json", methods=["GET", "POST"])
def get_unit(unitid):
    units = get_json("units.json")
    return jsonify(unit=units[unitid.replace("_", " ")])


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


@bp.route("/meta_progression/", methods=["GET", "POST"])
def meta_progression():
    return render_template("meta_progression.html")
