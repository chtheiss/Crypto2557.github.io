import idb from "@/api/idb";
import _ from "lodash";

function clearDatabase(idbDatabase, cb) {
  var transaction = idbDatabase.transaction(
    idbDatabase.objectStoreNames,
    "readwrite"
  );
  transaction.onerror = function(event) {
    cb(event);
  };
  var count = 0;
  _.forEach(idbDatabase.objectStoreNames, function(storeName) {
    transaction.objectStore(storeName).clear().onsuccess = function() {
      count++;
      if (count === idbDatabase.objectStoreNames.length)
        // cleared all object stores
        cb(null);
    };
  });
}

function importFromJsonString(idbDatabase, jsonString, cb) {
  var transaction = idbDatabase.transaction(
    idbDatabase.objectStoreNames,
    "readwrite"
  );
  transaction.onerror = function(event) {
    cb(event);
  };
  var importObject = JSON.parse(jsonString);
  console.log(importObject);
  _.forEach(idbDatabase.objectStoreNames, function(storeName) {
    console.log("Importing into", storeName);
    var count = 0;
    console.log(importObject[storeName]);
    _.forEach(importObject[storeName], function(toAdd) {
      console.log("Importing ", toAdd);
      var request = transaction.objectStore(storeName).add(toAdd);
      request.onsuccess = function(event) {
        console.log(event);
        count++;
        if (count === importObject[storeName].length) {
          // added all objects for this store
          delete importObject[storeName];
          if (_.keys(importObject).length === 0)
            // added all object stores
            cb(null);
        }
      };
    });
  });
}

function exportToJsonString(idbDatabase, cb) {
  var exportObject = {};
  if (idbDatabase.objectStoreNames.length === 0)
    cb(null, JSON.stringify(exportObject));
  else {
    var transaction = idbDatabase.transaction(
      idbDatabase.objectStoreNames,
      "readonly"
    );
    transaction.onerror = function(event) {
      cb(event, null);
    };
    _.forEach(idbDatabase.objectStoreNames, function(storeName) {
      var allObjects = [];
      transaction.objectStore(storeName).openCursor().onsuccess = function(
        event
      ) {
        var cursor = event.target.result;
        if (cursor) {
          allObjects.push(cursor.value);
          cursor.continue();
        } else {
          exportObject[storeName] = allObjects;
          if (
            idbDatabase.objectStoreNames.length === _.keys(exportObject).length
          ) {
            cb(null, JSON.stringify(exportObject));
          }
        }
      };
    });
  }
}

function ConvertV1ToV2Pets(petsV1, petsV2) {
  let newPets = [];
  for (let i = 0; i < petsV1.length; i++) {
    let pet = petsV2.filter(
      (pet) => pet.name == petsV1[i].name.replaceAll("_", " ")
    )[0];
    if (pet != undefined) {
      let petId = pet._id;
      newPets.push({
        id: petId,
        fragments: petsV1[i].fragments,
        priority: petsV1[i].priority,
      });
    }
  }
  return newPets;
}

String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

export const actions = {
  async loadDataFromJson(context, data) {
    let db = await idb.getDb();
    if (!data.includes("warp")) {
      console.log("Really? Still using version 1 data? *sigh*");
      data = JSON.parse(JSON.parse(data));
      await context.dispatch("units/getUnitsData", null, { root: true });
      await context.dispatch(
        "pets/getPetsData",
        {
          origin: "shn",
          storageName: "pets",
        },
        { root: true }
      );
      await context.dispatch(
        "pets/getPetsData",
        {
          origin: "shh",
          storageName: "pets_hard",
        },
        { root: true }
      );
      await context.dispatch("pets/getOtherPetsData", null, { root: true });

      let newUnits = [];
      for (let i = 0; i < data.player.length; i++) {
        data.player[i].value = parseInt(data.player[i].value);
      }
      for (let i = 0; i < data.units.length; i++) {
        let unitsV2 = context.rootState.units.data
          .filter(
            (unit) => unit.name == data.units[i].name.replaceAll("_", " ")
          )
          .sort((a, b) => a.stars - b.stars);
        newUnits.push({ id: unitsV2[0]._id, amount: data.units[i].nsr });
        if (unitsV2[0].stars == 5) {
          newUnits.push({ id: unitsV2[1]._id, amount: data.units[i].sr });
        }
      }
      data.units = newUnits;
      data.player.push({ name: "warp", value: 0 });

      data.pets = ConvertV1ToV2Pets(data.pets, context.rootState.pets.data);
      data.pets_hard = ConvertV1ToV2Pets(
        data.pets_hard,
        context.rootState.pets.dataHard
      );
      data.pets_other = ConvertV1ToV2Pets(
        data.pets_other,
        context.rootState.pets.dataOther
      );
      data = JSON.stringify(data);
    }
    console.log("Clearing old database!");
    clearDatabase(db, function(err) {
      if (err) {
        console.log("Encountered error while clearing database!");
      } else {
        console.log("Successfully cleared old database!");
        importFromJsonString(db, data, async function(err) {
          console.log("Importing new data!");
          if (err) {
            console.log("Encountered error while importing data!");
          } else {
            console.log("Dispatching all the state stuff");
          }
        });
      }
    });
  },
  async clearDatabase(context) {
    let db = await idb.getDb();
    clearDatabase(db, function(err) {
      if (err) {
        console.log("Encountered error while clearing database!");
      }
    });
    await context.dispatch("pets/resetState", null, { root: true });
    await context.dispatch("units/resetState", null, { root: true });
    await context.dispatch("stats/resetState", null, { root: true });
  },
  async downloadJsonFile() {
    let db = await idb.getDb();
    exportToJsonString(db, function(err, jsonString) {
      if (err) {
        console.error(err);
      } else {
        let dataStr =
          "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
        let downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "endless_farming.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    });
  },
};
