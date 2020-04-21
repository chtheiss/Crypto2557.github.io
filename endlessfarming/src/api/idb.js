const DB_NAME = "endless-farming-db";
const DB_VERSION = 6;
let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      console.log("OPENING DB", DB);
      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log("Error opening db", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        DB = e.target.result;
        resolve(DB);
      };

      request.onupgradeneeded = (e) => {
        console.log("onupgradeneeded");
        let db = e.target.result;
        if (e.oldVersion < 1) {
          let unitsOS = db.createObjectStore("units", {
            keyPath: "id",
          });
          unitsOS.createIndex("amount", "amount", {
            unique: false,
          });
          let petsOS = db.createObjectStore("pets", {
            keyPath: "id",
          });
          petsOS.createIndex("fragments", "fragments", {
            unique: false,
          });
        }
        if (e.oldVersion < 2) {
          let playerOS = db.createObjectStore("player", {
            keyPath: "name",
            autoIncrement: true,
          });
          playerOS.createIndex("value", "value", {
            unique: false,
          });
          playerOS.put({
            name: "KL",
            value: 1,
          });
          playerOS.put({
            name: "tickets",
            value: 10,
          });
          playerOS.put({
            name: "refills",
            value: 0,
          });
          let petsOS = request.transaction.objectStore("pets");
          petsOS.createIndex("priority", "priority", {
            unique: false,
          });
        }
        if (e.oldVersion < 3) {
          let pets_hardOS = db.createObjectStore("pets_hard", {
            keyPath: "id",
          });
          pets_hardOS.createIndex("fragments", "fragments", {
            unique: false,
          });
          pets_hardOS.createIndex("priority", "priority", {
            unique: false,
          });
          let playerOS = request.transaction.objectStore("player");
          playerOS.put({
            name: "tickets_hard",
            value: 5,
          });
          playerOS.put({
            name: "refills_hard",
            value: 0,
          });
        }
        if (e.oldVersion < 4) {
          let playerOS = request.transaction.objectStore("player");
          playerOS.put({
            name: "hide_five_star_pets",
            value: 0,
          });
        }
        if (e.oldVersion < 5) {
          let pets_otherOS = db.createObjectStore("pets_other", {
            keyPath: "id",
          });
          pets_otherOS.createIndex("fragments", "fragments", {
            unique: false,
          });
          pets_otherOS.createIndex("priority", "priority", {
            unique: false,
          });
          let playerOS = request.transaction.objectStore("player");
          playerOS.put({
            name: "hide_unattainable_pets",
            value: 0,
          });
        }
        if (e.oldVersion < 6) {
          let playerOS = request.transaction.objectStore("player");
          playerOS.put({
            name: "warp",
            value: 0,
          });
          playerOS.put({
            name: "edit_priorities",
            value: 0,
          });
        }
      };
    });
  },
  async saveStat(stat) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["player"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("player");
      store.put(stat);
    });
  },
  async getStat(stat) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["player"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("player");
      store.get(stat);
    });
  },
  async getStats() {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["player"], "readonly");
      trans.oncomplete = () => {
        resolve(stats);
      };

      let store = trans.objectStore("player");
      let stats = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          stats.push(cursor.value);
          cursor.continue();
        }
      };
    });
  },
  async savePet(pet, storageName) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction([storageName], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore(storageName);
      store.put(pet);
    });
  },
  async getPets(storageName) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction([storageName], "readonly");
      trans.oncomplete = () => {
        resolve(pets);
      };

      let store = trans.objectStore(storageName);
      let pets = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          pets.push(cursor.value);
          cursor.continue();
        }
      };
    });
  },
  async saveUnit(unit) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["units"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("units");
      store.put(unit);
    });
  },
  async getUnits() {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["units"], "readonly");
      trans.oncomplete = () => {
        resolve(units);
      };

      let store = trans.objectStore("units");
      let units = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          units.push(cursor.value);
          cursor.continue();
        }
      };
    });
  },
};
