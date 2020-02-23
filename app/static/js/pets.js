async function load_pet(pet, store, hide, kl) {
    $pet = $(pet)
    var data = await store.get(pet.id);
    hide_or_show_pet($pet, data, hide)
    $pet.find(".pet-input[type='number']").val(data.fragments);

    var $img = $pet.find(".pet-image")
    classes = ["five-star", "four-star", "three-star", "two-star", "one-star"]
    thresholds = [330, 180, 80, 30, 10];
    for (var idx of [0, 1, 2, 3, 4]) {
        if (data.fragments >= thresholds[idx]) {
            $img.removeClass("zero-star");
            $img.addClass(classes[idx]);
            break;
        }
    }

    var checkboxes = $pet.find(".pet-card-stars").find('.image-checkbox');
    for (var idx of [0, 1, 2, 3, 4]) {
        if (data.fragments >= thresholds[4 - idx]) {
            turn_star_on($(checkboxes[idx]))
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

function remove_classes($element, classes_not_to_remove) {
    var classes = $($element).attr('class').split(/\s+/);
    for (i = 0; i < classes.length; i += 1) {
        if (classes_not_to_remove.includes(classes[i])) {
            continue;
        }
        $element.removeClass(classes[i]);
    }
}

function updateStages(kl) {
    $(".col-kl").each(function() {
        var col = $(this);
        if (kl >= parseFloat(col.text())) {
            col.removeClass('col-red');
            col.addClass('col-green');
        } else {
            col.removeClass('col-green');
            col.addClass('col-red');
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

async function sortPetsByPriority() {
    var db = await idb.open('endless-farming-db');
    var tx = await db.transaction("pets", 'readwrite');
    var store = await tx.objectStore("pets");
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

async function updatePriorities() {
    var db = await idb.open('endless-farming-db');
    var tx = await db.transaction("pets", 'readwrite');
    var store = await tx.objectStore("pets");
    for (const child of $("#dragable-row").children()){
        $child = $(child);
        val = {
            name: $child.attr("id"),
            fragments: parseInt($child.find(".pet-input").val()),
            priority: parseInt($child.attr("data-id"))
        };
        await store.put(val);
    }
}

function on_pet_input_change($pet_input, storage_name) {
    var request = idb.open('endless-farming-db');
    request.then(function(db) {
        var tx = db.transaction(storage_name, 'readwrite');
        var store = tx.objectStore(storage_name);
        var item = {
            name: this.data("pet"),
            fragments: parseInt(this.val()),
            priority: parseInt(this.parents(".block").attr("data-id"))
        };
        var putRequest = store.put(item);
        return tx.complete;
    }.bind($pet_input)).then(function() {
        val = idb.open('endless-farming-db').then(function(db) {
            var tx = db.transaction(storage_name, 'readwrite');
            var store = tx.objectStore(storage_name);
            return store.get(this.data("pet"));
        }.bind(this)).then(function(val) {
            this.val(val.fragments);
            change_stars(val);
            calculatePetFragmentsToFarm();
            if ($('#hide-five-star-pets').prop("checked")) {
                hide_or_show_pet(this, false);
            }
        }.bind($pet_input));
    }.bind($pet_input));
}

function clear_tracking() {
    $("#tracking").children().each(function() {
        var track_col = $(this);
        track_col.css("display", "none");
        track_col.find("img").attr("src", "");
        track_col.attr("data-empty", "True");
        track_col.data("empty", "True");
        track_col.find("p").text("");
    });
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(function() {

        $(".pet-input[type='number']").inputSpinner();

        $(".image-checkbox").on("click", function(e) {
            var $checkbox = $(this).find('input[type="checkbox"]');
            var $input = $("#" + $(this).data("pet") + "-fragments");
            $input.val($checkbox.attr("value"));
            $input.change();
        });

        $("#add-all-btn").click(function() {
            $("#dragable-row").children('.block').each(function() {
                var col = $(this);
                var frags_to_add = parseInt(col.find(".col-fragments p").text());
                var input = col.find(".pet-input");
                var current_frags = handle_nan(parseInt(input.val()));
                if (frags_to_add > 0) {
                    input.val(current_frags + frags_to_add);
                    input.change();
                }
            });
        });
    });
}));