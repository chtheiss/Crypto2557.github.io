import json
import pdb

pet_file = "../app/static/json/pets.json"
with open(pet_file, "r") as json_file:
    pets = json.load(json_file)

pet_hard_file = "../app/static/json/hard_sh_pets.json"
with open(pet_hard_file, "r") as json_file:
    pets_hard = json.load(json_file)

pet_other_file = "../app/static/json/other_pets.json"
with open(pet_other_file, "r") as json_file:
    pets_other = json.load(json_file)

for key, items in pets.items():
    items["origin"] = ["nsh"]

for key, items in pets_hard.items():
    items["origin"] = ["shh"]
    if key in [p["name"] for p in pets_other]:
        other_pet = list(filter(lambda x: x["name"] == key, pets_other))[0]
    items["origin"].append(other_pet["origin"])

for pet in pets_other:
    pet["origin"] = [pet["origin"]]
    if pet["name"] in pets_hard.keys():
        pet["origin"].append("shh")


pdb.set_trace()
"""
os.remove(pet_other_file)
with open(pet_other_file, "w") as json_file:
    json.dump(pets_other, json_file, indent=4)

os.remove(pet_file)
with open(pet_file, "w") as json_file:
    json.dump(pets, json_file, indent=4)

os.remove(pet_hard_file)
with open(pet_hard_file, "w") as json_file:
    json.dump(pets_hard, json_file, indent=4)
"""
