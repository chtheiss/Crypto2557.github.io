import json
import os

filename = "../app/static/json/hard_sh_pet_priority.json"

with open(filename, "r") as json_file:
    data = json.load(json_file)

pets = data.values()
new_data = {}

for i, pet in enumerate(pets):
    new_data[str(i + 1)] = pet

os.remove(filename)
with open(filename, "w") as json_file:
    json.dump(new_data, json_file, indent=4)
