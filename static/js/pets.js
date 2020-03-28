function change_pet_image_background($pet, data) {
    let $img = $pet.find(".pet-image")
    const classes = ["five-star", "four-star", "three-star", "two-star", "one-star"]
    const thresholds = [330, 180, 80, 30, 10];
    for (let idx of [0, 1, 2, 3, 4]) {
        if (data.fragments >= thresholds[idx]) {
            remove_classes($img, ["pet-image"])
            $img.addClass(classes[idx]);
            return;
        }
    }
    $img.addClass("zero-star");
}

async function load_pet(pet, db, storage_name, hide, unattainable, kl) {
    const pet_tx = await db.transaction(storage_name, 'readwrite');
    const pet_store = await pet_tx.objectStore(storage_name);
    const data = await pet_store.get(pet.id);

    let $pet = $(pet);
    change_display_of_unattainable_pet($pet, unattainable)
    if (data != undefined) {
        hide_or_show_pet($pet, data.fragments >= 330 && hide)
        $pet.find(".pet-input[type='number']").val(data.fragments);
        change_pet_image_background($pet, data)
        let checkboxes = $pet.find(".pet-card-stars").find('.image-checkbox');
        const thresholds = [330, 180, 80, 30, 10];
        for (let idx of [0, 1, 2, 3, 4]) {
            if (data.fragments >= thresholds[4 - idx]) {
                turn_star_on($(checkboxes[idx]))
            }
        }
    }

    for (const kl_div of $pet.find(".pet-card-kl").find('div')) {
        let $kl_div = $(kl_div)
        if (parseFloat(kl) >= parseFloat($kl_div.text())) {
            $kl_div.addClass("green");
        }
    }
}

function turn_star_on($image_checkbox) {
    let $checkbox = $image_checkbox.find('input[type="checkbox"]');
    let $image = $image_checkbox.find('.img-responsive');
    $checkbox.prop("checked", true);
    $image.attr("src", "../static/img/star.png");
}

function turn_star_off($image_checkbox) {
    let $checkbox = $image_checkbox.find('input[type="checkbox"]');
    let $image = $image_checkbox.find('.img-responsive');
    $checkbox.prop("checked", false);
    $image.attr("src", "../static/img/stargrey.png");
}

function change_stars(val) {
    if (val.fragments >= 10) {
        turn_star_on($("#" + val.name.replace(" ", "_") + "-1star"));
    } else {
        turn_star_off($("#" + val.name.replace(" ", "_") + "-1star"));
    }
    if (val.fragments >= 30) {
        turn_star_on($("#" + val.name.replace(" ", "_") + "-2star"));
    } else {
        turn_star_off($("#" + val.name.replace(" ", "-") + "-2star"));
    }
    if (val.fragments >= 80) {
        turn_star_on($("#" + val.name.replace(" ", "_") + "-3star"));
    } else {
        turn_star_off($("#" + val.name.replace(" ", "_") + "-3star"));
    }
    if (val.fragments >= 180) {
        turn_star_on($("#" + val.name.replace(" ", "_") + "-4star"));
    } else {
        turn_star_off($("#" + val.name.replace(" ", "_") + "-4star"));
    }
    if (val.fragments >= 330) {
        turn_star_on($("#" + val.name.replace(" ", "-") + "-5star"));
    } else {
        turn_star_off($("#" + val.name.replace(" ", "_") + "-5star"));
    }
}

function updateStages(kl) {
    $(".pet-card-kl-number").each(function() {
        let col = $(this);
        if (kl >= parseFloat(col.text())) {
            col.removeClass('red');
            col.addClass('green');
        } else {
            col.removeClass('green');
            col.addClass('red');
        }
    });
}

function getPriority(hard) {
    let url = "";
    if (hard) {
        url = "https://endless-farming-backend.herokuapp.com/api/v1/priority/shh";
    } else {
        url = "https://endless-farming-backend.herokuapp.com/api/v1/priority/shn";
    }
    return $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: true
    });
}

async function sortPetsByPriority(storage_name) {
    const db = await idb.open('endless-farming-db');
    const tx = await db.transaction(storage_name, 'readwrite');
    const store = await tx.objectStore(storage_name);
    const items = await store.getAll();

    for (const item of items) {
        $("#" + item.name).attr("data-id", item.priority);
        $("#" + item.name).data("id", item.priority);
    }
    let listitems = $("#dragable-row").children('.pet-card').get();
    listitems.sort(function(a, b) {
        let compA = parseFloat($(a).data('id'));
        let compB = parseFloat($(b).data('id'));
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });
    let $superrow = $('#dragable-row');
    $.each(listitems, function(idx, itm) {
        $superrow.append(itm);
    });
    $("#dragable-row").removeClass("hidden");
    calculatePetFragmentsToFarm();
}

async function updatePriority($pet, store){
    const val = {
        name: $pet.attr("id"),
        fragments: parseInt($pet.find(".pet-input").val()),
        priority: parseInt($pet.attr("data-id"))
    };
    await store.put(val);
}

async function updatePriorities(storage_name) {
    const db = await idb.open('endless-farming-db');
    const tx = await db.transaction(storage_name, 'readwrite');
    const store = await tx.objectStore(storage_name);

    priorityPromises = [];

    for (const child of $("#dragable-row").children()) {
        updatePriority($(child), store);
    }
    await Promise.all(priorityPromises);
}

async function reset_priority(storage_name){
    data = await getPriority(storage_name == "pets_hard");
    const priority = data.data[0].pets;
    for (i = 0; i < priority.length; i++) {
        col = $("#" + priority[i].name.replaceAll(" ", "_"));
        col.attr("data-id", i);
        col.data("id", i);
    }
    await updatePriorities(storage_name);
    await sortPetsByPriority(storage_name);
}


async function on_pet_input_change($pet_input, storage_name) {
    $pet = $pet_input.closest(".pet-card,.pet-card-other").first();
    let item;
    const db = await idb.open('endless-farming-db');
    let tx = await db.transaction(storage_name, 'readwrite');
    let store = await tx.objectStore(storage_name);
    if($pet.hasClass("pet-card")){
        item = {
            name: $pet_input.data("pet"),
            fragments: parseInt($pet_input.val()),
            priority: parseInt($pet_input.parents(".pet-card,.pet-card-other").attr("data-id"))
        };
    } else {
        if (storage_name == "pets_hard"){
            let data = await store.get($pet_input.data("pet"));
            if (data != undefined){
                 item = {
                    name: $pet_input.data("pet"),
                    fragments: parseInt($pet_input.val()),
                    priority: data.priority
                };
            }else{
                const data = await getPriority(storage_name == "pets_hard");
                const prio_tx = await db.transaction(storage_name, 'readwrite');
                const prio_store = await prio_tx.objectStore(storage_name);
                prioPromises = [];
                const priority = data.data[0].pets;
                for (i = 0; i < priority.length; i++) {
                    let name = priority[i].name.replaceAll(" ", "_");
                    let $pet = $("#" + name)
                    if ($pet.data("origins") != undefined){
                        let prio_item = {
                            name: name,
                            fragments: parseInt($pet.find(".pet-input").val()),
                            priority: i
                        };
                        prioPromises.push(prio_store.put(prio_item));
                    }
                }
                await Promise.all(prioPromises);

                tx = await db.transaction(storage_name, 'readwrite');
                store = await tx.objectStore(storage_name);
                let pet_data = await store.get($pet_input.data("pet"));
                item = {
                    name: $pet_input.data("pet"),
                    fragments: parseInt($pet_input.val()),
                    priority: pet_data.priority
                };
            }

        } else {
            item = {
                name: $pet_input.data("pet"),
                fragments: parseInt($pet_input.val())
            };
        }
    }
    await store.put(item);
    change_stars(item);
    change_pet_image_background($pet, item);
    if($pet.hasClass("pet-card")){
        calculatePetFragmentsToFarm();
    }
    if ($('#hide-five-star-pets').prop("checked")) {
        hide_or_show_pet($pet, item.fragments >= 330);
    }
}

function clear_tracking() {
    $(".pet-trackers").children().each(function() {
        let tracker = $(this);
        tracker.css("display", "none");
        tracker.find("img").attr("src", "");
        tracker.attr("data-empty", "True");
        tracker.data("empty", "True");
        tracker.find("p").text("");
    });
}

async function load_all_pets(storage_name){
    const db = await idb.open('endless-farming-db');

    const player_tx = await db.transaction("player", 'readwrite');
    const player_store = await player_tx.objectStore("player");

    const hide_unattainable_pets = await player_store.get("hide_unattainable_pets");
    const hide_five_star_pets = await player_store.get("hide_five_star_pets");
    const knightage_level = await player_store.get("KL");

    const hide_unattainable_pets_result = await hide_unattainable_pets;
    const hide_five_star_pets_result = await hide_five_star_pets;
    const knightage_level_result = await knightage_level;

    $('#hide-unattainable-pets').prop("checked", hide_unattainable_pets_result.value);

    $('#hide-five-star-pets').prop("checked", hide_five_star_pets_result.value);

    petPromises = [];

    for (const pet of $(".pet-card,.pet-card-other")) {
        petPromises.push(
            load_pet(
                pet,
                db,
                storage_name,
                hide_five_star_pets_result.value,
                hide_unattainable_pets_result.value,
                knightage_level_result.value
            )
        );
    }
    await Promise.all(petPromises);
}

function create_sortable(storage_name){
    row = $("#dragable-row").get()[0];
    Sortable.create(row, {
        cursor: 'move',
        delayOnTouchOnly: true,
        animation: 50,
        draggable: ".pet-card",
        forceFallback: true,
        onUpdate: async function(event) {
            change = $("#dragable-row").children().filter(function() {
                id = parseInt($(this).attr("data-id"));
                if (event.newIndex < event.oldIndex) {
                    return id >= event.newIndex && id <= event.oldIndex;
                } else {
                    return id >= event.oldIndex && id <= event.newIndex;
                }

            });

            change.each(function() {
                let $col = $(this);
                if (event.newIndex < event.oldIndex) {
                    $col.attr("data-id", parseInt($col.attr("data-id")) + 1);
                    $col.data("id", parseInt($col.attr("id")) + 1);
                } else {
                    $col.attr("data-id", parseInt($col.attr("data-id")) - 1);
                    $col.data("id", parseInt($col.attr("id")) - 1);
                }
            });

            $(event.item).attr("data-id", event.newIndex);
            $(event.item).data("id", event.newIndex);

            await updatePriorities(storage_name);
            calculatePetFragmentsToFarm();
        },
    });
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(function() {

        $(".pet-input[type='number']").inputSpinner();

        $(".image-checkbox").on("click", function(e) {
            let $checkbox = $(this).find('input[type="checkbox"]');
            let $input = $("#" + $(this).data("pet") + "-fragments");
            $input.val($checkbox.attr("value"));
            $input.change();
        });
    });
}));