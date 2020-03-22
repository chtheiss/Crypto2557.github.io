import json

import numpy as np

with open("../app/static/json/hard_sh_pets.json") as json_file:
    file = json.load(json_file)
    pets = list(file.keys())
    keys = np.arange(1, len(pets) + 1)
    prio = dict([a for a in zip(keys.astype(str), pets)])
    with open("pet_prio.json", "w") as fp:
        json.dump(prio, fp)
