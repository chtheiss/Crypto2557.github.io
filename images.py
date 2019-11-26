import json
import os
import urllib.request


pets = json.load(open("app/static/json/pets.json"))
pets_hard = json.load(open("app/static/json/hard_sh_pets.json"))
units = json.load(open("app/static/json/units.json"))


def fetch_image(type, filename):
    target_file = "app/static/img/" + type + "/" + filename
    source_url = "https://www.endlessfrontierdata.com/images/" + type + "/" + filename

    if not os.path.isfile(target_file):
        try:
            print('Retrieving: {} from {}'.format(target_file, source_url))
            f = open(target_file, 'wb')
            f.write(urllib.request.urlopen(source_url).read())
            f.close()
        except:
            print('ERROR: failed to retrieve: {}'.format(source_url))


# units
for key, unit in units.items():
    img_file = os.path.basename(unit["img"])
    fetch_image("units", img_file)

    img_file_sr = os.path.basename(unit["img_sr"])
    fetch_image("units", img_file_sr)

# pets
for key, pet in pets.items():
    img_file = os.path.basename(pet["img"])
    fetch_image("pets", img_file)

# hard pets
for key, pet in pets_hard.items():
    img_file = os.path.basename(pet["img"])
    fetch_image("pets", img_file)

