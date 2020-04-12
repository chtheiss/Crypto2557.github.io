function getUnits() {
    return $.ajax({
        type: "GET",
        url: "https://endless-farming-backend.herokuapp.com/api/v1/units/",
        dataType: "json",
        async: true
    });
}

function getPets() {
    return $.ajax({
        type: "GET",
        url: "https://endless-farming-backend.herokuapp.com/api/v1/pets/origin/shn",
        dataType: "json",
        async: true
    });
}

function change_progress_bar_value($bar, value, max) {
    let siz = (value / max * 100).toFixed(2);
    $bar.css("width", siz + "%")
        .attr("aria-valuenow", value)
        .text(Number((value).toFixed(2)) + "/" + max);
    if (siz >= 100) {
        $bar.css("background-color", "#1ca51c");
    } else {
        $bar.css("background-color", "#ce2323");
    }
}

function update_progress_bar_values($progress_bar, buff) {
    $progress_bar
        .attr("aria-valuemax", buff.requirement)
        .text($progress_bar.attr("aria-valuenow") + "/" + $progress_bar.attr("aria-valuemax"))
        .attr("data-multiplier", buff.multiplier)
        .data("multiplier", buff.multiplier);
    if (buff.linked_units != undefined) {
        $progress_bar.attr("data-linked-units", buff.linked_units.toString())
            .data("linked-units", buff.linked_units.toString());
    }
    if (buff.linked_multiplier != undefined) {
        $progress_bar.attr("data-linked-multiplier", buff.linked_multiplier.toString())
            .data("linked-multiplier", buff.linked_multiplier.toString());
    }
 }

function get_unit_input_values($input) {
    let val = 0;
    let val_sr = 0;
    if ($input.attr("id").endsWith("-sr")) {
        val_sr += handle_nan(parseInt($input.val()));
        val += handle_nan(parseInt($("#" + $input.attr("id").replace("-sr", "")).val()));
    } else {
        val_sr += handle_nan(parseInt($("#" + $input.attr("id") + "-sr").val()));
        val += handle_nan(parseInt($input.val()));
    }
    return {
        nsr: val,
        sr: val_sr
    };
}

function update_progress_bar($bar, $input) {
    let linked_units = $bar.data("linked-units");
    let unit_values = get_unit_input_values($input);
    let multiplier = parseFloat($bar.attr("data-multiplier"));
    let max = $bar.attr("aria-valuemax");
    let current_progress;
    if (linked_units != "") {
        linked_units = linked_units.toString().split(",").map(Number);
        let linked_multiplier = $bar.attr("data-linked-multiplier").split(",").map(Number);
        let val_linked = 0;
        let val_sr_linked = 0;
        let add_progress_bars;
        for (i = 0; i < linked_units.length; i++) {
            let $unit_cell = $("#unit-" + linked_units[i]);
            let other_unit_values = get_unit_input_values($unit_cell.find(".unit-input[type='number']").first());
            val_linked += linked_multiplier[i] * other_unit_values.nsr;
            val_sr_linked += linked_multiplier[i] * other_unit_values.sr;
            add_progress_bars = $unit_cell.find(
                    ".progress-bar[data-linked-units*=" + $input.data("unit") + "]")
        }
        current_progress = multiplier * unit_values.nsr + unit_values.sr + (multiplier * val_linked + val_sr_linked);
    } else {
        current_progress = multiplier * unit_values.nsr + unit_values.sr;
    }
    change_progress_bar_value($bar, current_progress, max);
}
async function load_input_values($unit_input) {
    db = await idb.open('endless-farming-db');
    let tx = await db.transaction('units', 'readwrite');
    let store = await tx.objectStore('units');
    let data = await store.getAll();
    for (const unit_input of $(".unit-input[type='number']")) {
        let $unit_input = $(unit_input)
        let unit_name = $unit_input.data("unit-name").replaceAll(" ", "_")
        let val = data.filter(d => d.name == unit_name)[0]
        if (val) {
            if ($unit_input.attr("id").endsWith("-sr")) {
                $unit_input.val(val.sr);
            } else {
                $unit_input.val(val.nsr);
            }
        }
    }
}

function update_all_progress_bars_of_input($input) {
    let $unit_cell = $("#unit-" + $input.data("unit"));

    for (const bar of $unit_cell.find('[role="progressbar"]')) {
        update_progress_bar($(bar), $input);
    }

    all_unit_ids = []
    for (const bar of $unit_cell.find('[role="progressbar"]')) {
        let linked_units = $(bar).data("linked-units");
        if (linked_units != "") {
            linked_units = linked_units.toString().split(",").map(Number);
            all_unit_ids.push(...linked_units)
        }
    }
    for (let unit_card of $(all_unit_ids.map(id => "#unit-" + id).join())){
        $unit_card = $(unit_card)
        for (let bar of $unit_card.find('[role="progressbar"]')) {
            for (let input of $unit_card.find(".unit-input[type='number']")) {
                update_progress_bar($(bar), $(input));
            }
        }
    }
}

function showAdditionalBuffProgressBars($unit_card) {
    let $prog_bar_add_buff = $unit_card.find(".additional_buff");
    $prog_bar_add_buff.removeClass("hidden");
    $prog_bar_add_buff.parent().popover().removeClass("hidden");
}

function changeBuffRequirement(buff, pet_buff, pets, petData, five_star_pet){
    if(buff.linked_pets.length == 0){
        buff.requirement = buff.requirement[0]
    }
    else {
        let linked_active_pets = pet_buff.linked_pets.filter(linked_pet_id =>
                pets.filter(pet =>
                    pet.name == petData.data.filter(p =>
                        p._id == linked_pet_id)[0].name.replaceAll(" ", "_") & pet.fragments >= 330).length > 0
            )
        let req = five_star_pet + linked_active_pets.length
        if(req == 0){
            req = 1;
        }
        buff.requirement = buff.requirement[req-1]
    }
    return buff
}

(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {

        $(".unit-input[type='number']").inputSpinner();
        $(".input-group-append button, .input-group-prepend button").removeAttr('style');

        $('[data-toggle="popover"]').each(function() {
            prog_bar = $(this).children().first();
            if (!$(prog_bar).attr('class').split(/\s+/).includes("progress-bar-hidden")) {
                $(this).popover();
            }
        });

        $(".modal").on('shown.bs.modal', function(e) {
            let tab = e.relatedTarget.hash;
            $('.nav-tabs a[href="' + tab + '"]').tab('show');
        });

        db = await idb.open("endless-farming-db")
        let tx = await db.transaction('pets', 'readwrite');
        let store = await tx.objectStore('pets');
        let pets = await store.getAll();

        let unitData = await getUnits()
        let petData = await getPets()

        await load_input_values();
        for (const unit_card of $('.unit-card, .ex-unit-card')) {
            $unit_card = $(unit_card);
            let unit_id = unit_card.id.replaceAll("unit-", " ")
            let unit = unitData.data.filter(u => u._id == unit_id)[0]

            let $pet_image = $unit_card.find('.pet-image')
            let pet_name = $pet_image.data("pet")
            let five_star_pet = pets.filter(pet => pet.name == pet_name & pet.fragments >= 330)

            if (five_star_pet.length) {
                // Highlight pet
                $pet_image.addClass("five-star-pet");
                // Add additional buffs
                showAdditionalBuffProgressBars($unit_card)
                for (let buff of unit.pet.additional_buffs) {
                    buff = changeBuffRequirement(buff, buff, pets, petData, true);
                    let $progbar = $unit_card.find('[data-original-title="' + buff.name + '"]').find(".progress-bar");
                    update_progress_bar_values($progbar, buff);
                }
            }

            for (let buff of unit.buffs) {
                let pet_buff = unit.pet.buffs.filter(pet_buff => pet_buff.name == buff.name)[0]
                if (five_star_pet.length & pet_buff != undefined) {
                    pet_buff.linked_multiplier = buff.linked_multiplier;
                    buff = pet_buff;
                    let $buff_span = $unit_card.find('[data-original-title="' + buff.name + '"]');
                    $buff_span.attr("data-content", buff.description);
                }
                buff = changeBuffRequirement(buff, pet_buff, pets, petData, five_star_pet.length!=0);
                let $progbar = $unit_card.find('[data-original-title="' + buff.name + '"]').find(".progress-bar");
                update_progress_bar_values($progbar, buff);
            }

            for (let bar of $unit_card.find('[role="progressbar"]')) {
                for (let input of $unit_card.find(".unit-input[type='number']")) {
                    update_progress_bar($(bar), $(input));
                }
            }
        }

        $(".unit-input[type='number']").bind('change', async function(evt) {
            evt.stopImmediatePropagation();
            $this = $(this);
            update_all_progress_bars_of_input($this);
            db = await idb.open('endless-farming-db')
            let tx = await db.transaction('units', 'readwrite');
            let store = await tx.objectStore('units');
            unit_values = get_unit_input_values($this);
            let item = {
                name: $this.data("unit-name").replaceAll(" ", "_"),
                nsr: unit_values.nsr,
                sr: unit_values.sr
            };
            store.put(item);
        });

        $(".unit-container").removeClass("hidden");

        $('[data-toggle="tooltip"]').tooltip();
    });
}));