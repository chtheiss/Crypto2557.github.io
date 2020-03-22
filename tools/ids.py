import json
import os
import pdb

pet_file = "../app/static/json/pets.json"
with open(pet_file, "r") as json_file:
    pets = json.load(json_file)

for key, items in pets.items():
    for name, info in items["description"].items():
        items[name] = info
    items.pop("description")


pdb.set_trace()

os.remove(pet_file)
with open(pet_file, "w") as json_file:
    json.dump(pets, json_file, indent=4)
