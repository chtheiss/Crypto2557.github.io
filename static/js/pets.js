function change_pet_image_background($pet, data) {
    var $img = $pet.find(".pet-image")
    classes = ["five-star", "four-star", "three-star", "two-star", "one-star"]
    thresholds = [330, 180, 80, 30, 10];
    for (var idx of [0, 1, 2, 3, 4]) {
        if (data.fragments >= thresholds[idx]) {
            remove_classes($img, ["pet-image"])
            $img.addClass(classes[idx]);
            return;
        }
    }
    $img.addClass("zero-star");
}

async function load_pet(pet, store, hide, unattainable, kl) {
    $pet = $(pet)
    var data = await store.get(pet.id);
    kl_numbers = $pet.find(".pet-card-kl-number")
    let no_stage_available = (kl_numbers.length == kl_numbers.filter(function( index ) {
        return $("#KL-number").val() < parseFloat($(this).text());
    }).length)
    hide_or_show_unattainable_pet($pet, no_stage_available && unattainable)
    if (data != undefined) {
        hide_or_show_pet($pet, data.fragments >= 330 && hide)
        $pet.find(".pet-input[type='number']").val(data.fragments);
        change_pet_image_background($pet, data)
        var checkboxes = $pet.find(".pet-card-stars").find('.image-checkbox');
        thresholds = [330, 180, 80, 30, 10];
        for (var idx of [0, 1, 2, 3, 4]) {
            if (data.fragments >= thresholds[4 - idx]) {
                turn_star_on($(checkboxes[idx]))
            }
        }
    }

    for (const kl_div of $pet.find(".pet-card-kl").find('div')) {
        $kl_div = $(kl_div)
        if (parseFloat(kl) >= parseFloat($kl_div.text())) {
            $kl_div.addClass("green");
        }
    }
}

function turn_star_on($image_checkbox) {
    var $checkbox = $image_checkbox.find('input[type="checkbox"]');
    var $image = $image_checkbox.find('.img-responsive');
    $checkbox.prop("checked", true);
    $image.attr("src", "../static/img/star.png");
}

function turn_star_off($image_checkbox) {
    var $checkbox = $image_checkbox.find('input[type="checkbox"]');
    var $image = $image_checkbox.find('.img-responsive');
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
        var col = $(this);
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
    var url = "";
    if (hard) {
        url = "core.get_hard_sh_priority";
    } else {
        url = "core.get_priority";
    }
    return $.ajax({
        type: "GET",
        url: Flask.url_for(url),
        dataType: "json",
        async: true
    });
}

async function sortPetsByPriority(storage_name) {
    var db = await idb.open('endless-farming-db');
    var tx = await db.transaction(storage_name, 'readwrite');
    var store = await tx.objectStore(storage_name);
    var items = await store.getAll();
    for (let item of items) {
        $("#" + item.name).attr("data-id", item.priority);
        $("#" + item.name).data("id", item.priority);
    }
    var listitems = $("#dragable-row").children('.pet-card').get();
    listitems.sort(function(a, b) {
        var compA = parseFloat($(a).data('id'));
        var compB = parseFloat($(b).data('id'));
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });
    var $superrow = $('#dragable-row');
    $.each(listitems, function(idx, itm) {
        $superrow.append(itm);
    });
    $("#dragable-row").removeClass("hidden");
    calculatePetFragmentsToFarm();
}

async function updatePriorities(storage_name) {
    var db = await idb.open('endless-farming-db');
    var tx = await db.transaction(storage_name, 'readwrite');
    var store = await tx.objectStore(storage_name);
    for (const child of $("#dragable-row").children()) {
        $child = $(child);
        val = {
            name: $child.attr("id"),
            fragments: parseInt($child.find(".pet-input").val()),
            priority: parseInt($child.attr("data-id"))
        };
        await store.put(val);
    }
}

async function on_pet_input_change($pet_input, storage_name) {
    $pet = $pet_input.closest(".pet-card,.pet-card-other").first()
    if($pet.hasClass(".pet-card")){
        var item = {
            name: $pet_input.data("pet"),
            fragments: parseInt($pet_input.val()),
            priority: parseInt($pet_input.parents(".pet-card,.pet-card-other").attr("data-id"))
        };
    } else {
        var item = {
            name: $pet_input.data("pet"),
            fragments: parseInt($pet_input.val())
        };
    }
    var db = await idb.open('endless-farming-db');
    var tx = await db.transaction(storage_name, 'readwrite');
    var store = await tx.objectStore(storage_name);
    var putRequest = await store.put(item);
    change_stars(item);

    change_pet_image_background($pet, item);
    if($pet.hasClass(".pet-card")){
        calculatePetFragmentsToFarm();
    }
    if ($('#hide-five-star-pets').prop("checked")) {
        hide_or_show_pet($pet, item.fragments >= 330);
    }
}

function clear_tracking() {
    $(".pet-trackers").children().each(function() {
        var tracker = $(this);
        tracker.css("display", "none");
        tracker.find("img").attr("src", "");
        tracker.attr("data-empty", "True");
        tracker.data("empty", "True");
        tracker.find("p").text("");
    });
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(function() {

        $(".pet-input[type='number']").inputSpinner();
        $(".input-group-append button, .input-group-prepend button").removeAttr('style');

        $(".image-checkbox").on("click", function(e) {
            var $checkbox = $(this).find('input[type="checkbox"]');
            var $input = $("#" + $(this).data("pet") + "-fragments");
            $input.val($checkbox.attr("value"));
            $input.change();
        });

        $("#add-all-btn").click(function() {
            $("#dragable-row").children('.pet-card').each(function() {
                var $pet = $(this);
                var frags_to_add = parseInt($pet.find(".pet-card-frags").text());
                var input = $pet.find(".pet-input");
                var current_frags = handle_nan(parseInt(input.val()));
                if (frags_to_add > 0) {
                    input.val(current_frags + frags_to_add);
                    input.change();
                }
            });
        });
    });
}));