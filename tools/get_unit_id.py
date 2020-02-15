import json
import os
import re

ids = []


def remove_values_from_list(the_list, val):
    return [value for value in the_list if value != val]


pet_file = "../app/static/json/pets.json"
with open(pet_file, "r") as json_file:
    pets = json.load(json_file)


unit_file = "../app/static/json/units.json"
with open(unit_file, "r") as json_file:
    units = json.load(json_file)


unit_names = []
for key, items in pets.items():
    m = re.search("\[.*\]", items["description"]["skill3"])
    unit_name = m.group(0)[9:-2]
    try:
        items["couple"] = units[unit_name]["img_sr"].split("/")[-1].split(".")[0]
    except:
        print(unit_name)

os.remove(pet_file)
with open(pet_file, "w") as json_file:
    json.dump(pets, json_file, indent=4)
