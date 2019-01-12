/**
 * Export all data from an IndexedDB database
 * @param {IDBDatabase} idbDatabase - to export from
 * @param {function(Object, <string|void>)} cb - callback with signature (error, jsonString)
 */
function exportToJsonString(cb) {
	var exportObject = {};
	idb.open('endless-farming-db').then(function(db) {
		if(db.objectStoreNames.length === 0){
			return cb(null, JSON.stringify(exportObject));
		} else {
			var tx = db.transaction(db.objectStoreNames, "readonly");
			tx.onerror = function(event) {
				cb(event, null);
			};
			
			_.forEach(db.objectStoreNames, function(storeName) {
				var allObjects = [];
				tx.objectStore(storeName).openCursor().then(function(cursor) {
					if (!cursor){
						exportObject[storeName] = allObjects;
						console.log(exportObject);
						if(db.objectStoreNames.length === keys(exportObject).length) {
							console.log(exportObject);	
							cb(null, JSON.stringify(exportObject));
						}
						return
					} else {
						allObjects.push(cursor.value);
						cursor.continue();
					}
				});
			});
		}
	});
	 
}

/**
 * Import data from JSON into an IndexedDB database. This does not delete any existing data
 *  from the database, so keys could clash
 *
 * @param {IDBDatabase} idbDatabase - to import into
 * @param {string} jsonString - data to import, one key per object store
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 */
function importFromJsonString(idbDatabase, jsonString, cb) {
	var transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readwrite");
	transaction.onerror = function(event) {
		cb(event);
	};
	var importObject = JSON.parse(jsonString);
	forEach(idbDatabase.objectStoreNames, function(storeName) {
		var count = 0;
		forEach(importObject[storeName], function(toAdd) {
			var request = transaction.objectStore(storeName).add(toAdd);
			request.onsuccess = function(event) {
					count++;
					if(count === importObject[storeName].length) { // added all objects for this store
						delete importObject[storeName];
						if(keys(importObject).length === 0) // added all object stores
							cb(null);
					}
				}
		});
	});
}

/**
 * Clears a database of all data
 *
 * @param {IDBDatabase} idbDatabase - to delete all data from
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 */
function clearDatabase(idbDatabase, cb) {
	var transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readwrite");
	transaction.onerror = function(event) {
		cb(event);
	};
	var count = 0;
	forEach(idbDatabase.objectStoreNames, function(storeName) {
		transaction.objectStore(storeName).clear().onsuccess = function() {
			count++;
			if(count === idbDatabase.objectStoreNames.length) // cleared all object stores
				cb(null);
		};
	});
}
