String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function handle_nan(val) {
    return (isNaN(val)) ? 0 : val;
}

function remove_classes($element, classes_not_to_remove) {
    let classes = $($element).attr('class').split(/\s+/);
    for (i = 0; i < classes.length; i += 1) {
        if (classes_not_to_remove.includes(classes[i])) {
            continue;
        }
        $element.removeClass(classes[i]);
    }
}

function change_gem_label($refill_number, $gem_label, costs) {
    function getSum(total, num) {
        return total + num;
    }
    $gem_label.text(costs.slice(0, handle_nan(parseInt($refill_number.val())) + 1).reduce(getSum));
}

function hide_or_show_pet($pet,hide) {
    if (hide) {
        $pet.addClass('invisible');
    } else {
        $pet.removeClass('invisible');
    }
}

function hide_or_show_unattainable_pet($pet, unattainable) {
    if (unattainable) {
        $pet.addClass('unattainable');
    } else {
        $pet.removeClass('unattainable');
    }
}

function load_file_into_indexedDB(file){
    let fr = new FileReader();
    fr.onload = function(e) {
        let result = JSON.parse(e.target.result);
        let db = new Dexie('endless-farming-db');
        db.open().then(function() {
            let idb_db = db.backendDB();
            clearDatabase(idb_db, function(err) {
                if (!err) {
                    importFromJsonString(idb_db, result, async function(err) {
                        if (!err) {
                            console.log("Imported data successfully");
                            console.log("Fixing compatibility issues with version <=1.4.6");
                            let db = await idb.open('endless-farming-db');
                            let tx = await db.transaction("player", 'readwrite');
                            let store = await tx.objectStore("player");
                            let hide_five_star_pets = await store.get("hide_five_star_pets")
                            if (hide_five_star_pets != undefined){
                                if (typeof hide_five_star_pets.value === "boolean"){
                                    await store.put({
                                        "name": "hide_five_star_pets",
                                        "value": hide_five_star_pets.value & 1 
                                    })
                                }
                            } else{
                                await store.put({
                                        "name": "hide_five_star_pets",
                                        "value": 0
                                })
                            }
                            let hide_unattainable_pets = await store.get("hide_unattainable_pets")
                            if (hide_unattainable_pets != undefined){
                                if (typeof hide_unattainable_pets.value === "boolean"){
                                    await store.put({
                                        "name": "hide_unattainable_pets",
                                        "value": hide_unattainable_pets.value & 1 
                                    })
                                }
                            } else{
                                await store.put({
                                        "name": "hide_unattainable_pets",
                                        "value": 0
                                })
                            }
                            location.reload();
                            return false;
                        } else {
                            console.log("Encountered error while importing")
                        }
                    });
                } else {
                    console.log("Encountered error while clearing database")
                }
            });
        });
    };
    fr.readAsText(file)
}

async function load_user_stats_from_db(){
    const db = await idb.open('endless-farming-db');
    const tx = await db.transaction('player', 'readwrite');
    const store = await tx.objectStore('player');

    const knightage_level = store.get("KL");
    const tickets = store.get("tickets");
    const refills = store.get("refills");
    const tickets_hard = store.get("tickets_hard");
    const refills_hard = store.get("refills_hard");
    const hide_five_star_pets = store.get("hide_five_star_pets");
    const hide_unattainable_pets = store.get("hide_unattainable_pets");

    const knightage_level_result = await knightage_level;
    const tickets_result = await tickets;
    const refills_result = await refills;
    const tickets_hard_result = await tickets_hard;
    const refills_hard_result = await refills_hard;
    const hide_five_star_pets_result = await hide_five_star_pets;
    const hide_unattainable_pets_result = await hide_unattainable_pets;

    if (knightage_level_result !== undefined) {
        $("#KL-number").val(knightage_level_result.value);
    }
    if (tickets_result !== undefined) {
        $("#tickets-number").val(tickets_result.value);
    }
    if (refills_result !== undefined) {
        $("#refills-number").val(refills_result.value);
        change_gem_label($("#refills-number"), $("#gem-label"), [0, 100, 200, 400, 800, 1200, 1600]);
    }
    if (tickets_hard_result !== undefined) {
        $("#tickets_hard-number").val(tickets_hard_result.value);
    }
    if (refills_hard_result !== undefined) {
        $("#refills_hard-number").val(refills_hard_result.value);
        change_gem_label($("#refills_hard-number"), $("#gem-hard-label"), [0, 200, 400, 800]);
    }
    if (hide_five_star_pets_result !== undefined) {
        $('#hide-five-star-pets').prop("checked", hide_five_star_pets_result.value);
    }
    if (hide_unattainable_pets_result !== undefined) {
        $('#hide-unattainable-pets').prop("checked", hide_unattainable_pets_result.value);
    }
}

function download_file_from_indexedDB(){
    let db = new Dexie('endless-farming-db');
    db.open().then(function() {
        let idb_db = db.backendDB();
        exportToJsonString(idb_db, function(err, jsonString) {
            if (err) {
                console.error(err);
            } else {
                let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonString));
                let downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "endless_farming.json");
                document.body.appendChild(downloadAnchorNode); // required for firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            }
        });
    });    
}

(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {

        $(".user-input[type='number']").inputSpinner();

        await load_user_stats_from_db()

        $("#import-button").click(function() {
            $('#dbupload').trigger('click');
        });

        $("#dbupload").change(async function(e) {
            let files = document.getElementById('dbupload').files;
            file = files.item(0)
            load_file_into_indexedDB(file)
        });

        $("#export-button").on("click", function(e) {
            download_file_from_indexedDB()
        });


        $(".user-input").bind('change', async function() {
            $this = $(this);
            const new_KL = $this.val();

            const db = await idb.open('endless-farming-db');
            const tx = await db.transaction('player', 'readwrite');
            const store = await tx.objectStore('player');

            store.put({
                name: $this.attr("id").replace("-number", ""),
                value: new_KL
            });

            if ($this.attr("id") == "KL-number" && $("#dragable-row").length != 0) {
                updateStages(new_KL);
            }
            if ($("#dragable-row").length != 0) {
                calculatePetFragmentsToFarm();
            }
        });

        $("#hide-five-star-pets").bind('change', async function() {
            const db = await idb.open('endless-farming-db');
            const tx = await db.transaction('player', 'readwrite');
            const store = await tx.objectStore('player');

            const hide = $(this).prop("checked");

            store.put({
                name: 'hide_five_star_pets',
                value: hide & 1
            });

            for (const pet of $("#dragable-row,.pet-table").children('.pet-card,.pet-card-other')) {
                let $pet = $(pet)
                let input = $pet.find(".pet-input[type='number']");
                hide_or_show_pet($pet, input.val() >= 330 && hide);
            }

        });

        $("#hide-unattainable-pets").bind('change', async function() {
            $this = $(this);
            const db = await idb.open('endless-farming-db');
            const tx = await db.transaction('player', 'readwrite');
            const store = await tx.objectStore('player');

            const hide = $(this).prop("checked");

             store.put({
                name: 'hide_unattainable_pets',
                value: hide & 1
            });

            for (const pet of $("#dragable-row").children('.pet-card,.pet-card-other')) {
                let $pet = $(pet);
                let kl_numbers = $pet.find(".pet-card-kl-number");
                let unattainable = (kl_numbers.length == kl_numbers.filter(function( index ) {
                    return $("#KL-number").val() < parseFloat($(this).text());
                }).length)
                if(unattainable){
                    hide_or_show_unattainable_pet($pet, unattainable && hide);
                }
            }

        });

        $("#refills-number").bind('change', function() {
            change_gem_label($(this), $("#gem-label"), [0, 100, 200, 400, 800, 1200, 1600]);
        });

        $("#refills_hard-number").bind('change', function() {
            change_gem_label($(this), $("#gem-hard-label"), [0, 200, 400, 800]);
        });
    });

    (async function() {
        'use strict';
        //check for support
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
            return;
        }
        const dbPromise = idb.open('endless-farming-db', 5, function(upgradeDb) {
            switch (upgradeDb.oldVersion) {
                case 0:{
                    if (!upgradeDb.objectStoreNames.contains('units')) {
                        let unitsOS = upgradeDb.createObjectStore('units', {
                            keyPath: 'name'
                        });
                        unitsOS.createIndex('nsr', 'nsr', {
                            unique: false
                        });
                        unitsOS.createIndex('sr', 'sr', {
                            unique: false
                        });
                    }
                    if (!upgradeDb.objectStoreNames.contains('pets')) {
                        let petsOS = upgradeDb.createObjectStore('pets', {
                            keyPath: 'name'
                        });
                        petsOS.createIndex('fragments', 'fragments', {
                            unique: false
                        });
                    }
                }
                case 1:{
                    if (!upgradeDb.objectStoreNames.contains('player')) {
                        let playerOS = upgradeDb.createObjectStore('player', {
                            keyPath: 'name',
                            autoIncrement: true
                        });
                        playerOS.createIndex('value', 'value', {
                            unique: false
                        });
                        playerOS.get("KL").then(function(val) {
                            if (val == undefined) {
                                playerOS.put({
                                    "name": "KL",
                                    "value": 1
                                });
                            }
                        });
                        playerOS.get("tickets").then(function(val) {
                            if (val == undefined) {
                                playerOS.put({
                                    "name": "tickets",
                                    "value": 10
                                });
                            }
                        });
                        playerOS.get("refills").then(function(val) {
                            if (val == undefined) {
                                playerOS.put({
                                    "name": "refills",
                                    "value": 0
                                });
                            }
                        });
                    }
                    let petsOS = upgradeDb.transaction.objectStore('pets');
                    petsOS.createIndex('priority', 'priority', {
                        unique: false
                    });
                }
                case 2:{
                    if (!upgradeDb.objectStoreNames.contains('pets_hard')) {
                        let pets_hardOS = upgradeDb.createObjectStore('pets_hard', {
                            keyPath: 'name'
                        });
                        pets_hardOS.createIndex('fragments', 'fragments', {
                            unique: false
                        });
                        pets_hardOS.createIndex('priority', 'priority', {
                            unique: false
                        });
                    }
                    let playerOS = upgradeDb.transaction.objectStore('player');
                    playerOS.get("tickets_hard").then(function(val) {
                        if (val == undefined) {
                            playerOS.put({
                                "name": "tickets_hard",
                                "value": 5
                            });
                        }
                    });
                    playerOS.get("refills_hard").then(function(val) {
                        if (val == undefined) {
                            playerOS.put({
                                "name": "refills_hard",
                                "value": 0
                            });
                        }
                    });
                }
                case 3:{
                    let playerOS = upgradeDb.transaction.objectStore('player');
                    playerOS.get("hide_five_star_pets").then(function(val) {
                        if (val == undefined) {
                            playerOS.put({
                                "name": "hide_five_star_pets",
                                "value": 0
                            });
                        }
                    });
                }
                case 4:{
                    if (!upgradeDb.objectStoreNames.contains('pets_other')) {
                        let pets_hardOS = upgradeDb.createObjectStore('pets_other', {
                            keyPath: 'name'
                        });
                        pets_hardOS.createIndex('fragments', 'fragments', {
                            unique: false
                        });
                    }
                    let playerOS = upgradeDb.transaction.objectStore('player');
                    playerOS.get("hide_unattainable_pets").then(async function(val) {
                        if (val == undefined) {
                            await playerOS.put({
                                "name": "hide_unattainable_pets",
                                "value": 0
                            });
                        }
                    });
                }
            }
        });
        await dbPromise;
    })();
}));