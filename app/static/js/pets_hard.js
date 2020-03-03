function calculatePetFragmentsToFarm() {
    var KL = parseInt($("#KL-number").val());
    var tickets = parseInt($("#tickets_hard-number").val()) + parseInt(3 * $("#refills_hard-number").val());
    var row = $("#dragable-row");

    clear_tracking();

    row.children().each(function() {
        var col = $(this);
        var possible_stages = [];
        var from_stage = [];
        var fragments = 0;
        var current_frags = 0;
        col.find('.pet-card-kl-number.green').each(function() {
            possible_stages.push(parseInt($(this).text()));
            from_stage.push(parseInt($(this).data("from")));
        });
        for (let stage of from_stage) {
            current_frags = handle_nan(parseInt(col.find(".pet-input").val()));
            current_frags = (current_frags > 330) ? 330 : current_frags;
            if (current_frags == 330) {
                break;
            }
            if (tickets > 0) {
                var add = 1;
                fragments += (tickets >= add) ? add : tickets;
                tickets -= (tickets >= add) ? add : tickets;
            }
        }
        tickets += (fragments > 330 - current_frags) ? fragments - (330 - current_frags) : 0;
        fragments = (fragments > 330 - current_frags) ? 330 - current_frags : fragments;
        frag_text = col.find("p");
        frag_text.text(fragments);

        var track_col = $('.col-2[data-empty="True"]').first();

        if (fragments > 0) {
            frag_text.removeClass('zero-fragments');
            var days = Math.ceil((330 - current_frags) / fragments);
            track_col.css("display", "");
            track_col.find("img").attr("src", col.find(".pet-image").attr("src"));
            track_col.attr("data-empty", "False");
            track_col.data("empty", "False");
            track_col.find("p").text(days + " days");
            track_col.parent(".justify-content-center").css("display", "");

        } else {
            frag_text.addClass('zero-fragments');
            if (track_col.attr("id") == "track-1") {
                track_col.parent(".justify-content-center").css("display", "none");
            }
        }
    });
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {

        var db = await idb.open('endless-farming-db');

        var player_tx = await db.transaction("player", 'readwrite');
        var player_store = await player_tx.objectStore("player");
        var hide_five_star_pets = await player_store.get("hide_five_star_pets");
        var kl = await player_store.get("KL");
        $('#hide-five-star-pets').prop("checked", hide_five_star_pets.value);

        var tx = await db.transaction("pets_hard", 'readwrite');
        var store = await tx.objectStore("pets_hard");

        var hide = $('#hide-five-star-pets').prop("checked");

        for (const pet of $(".pet-card")){
            await load_pet(pet, store, hide, kl.value);
        }

        row = $("#dragable-row").get()[0];
        sortable = Sortable.create(row, {
            cursor: 'move',
            animation: 150,
            onUpdate: function(event) {
                change = $("#dragable-row").children().filter(function() {
                    id = parseInt($(this).attr("data-id"));
                    if (event.newIndex < event.oldIndex) {
                        return id >= event.newIndex && id <= event.oldIndex;
                    } else {
                        return id >= event.oldIndex && id <= event.newIndex;
                    }

                });

                change.each(function() {
                    var $col = $(this);
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

                updatePriorities("pets_hard");
                calculatePetFragmentsToFarm();
            },
        });

        $(".pet-input[type='number']").bind('change', function() {
            on_pet_input_change($(this), "pets_hard");
        });

        $("#reset-btn").click(async function() {
            data = await getPriority(true);
            var priority = data.priority;

            for (let p in priority) {
                col = $("#" + priority["" + p].replaceAll(" ", "_"));
                col.attr("data-id", p - 1);
                col.data("id", p - 1);
            }
            await updatePriorities('pets_hard');
            await sortPetsByPriority('pets_hard');
        });

        sortPetsByPriority("pets_hard");
    });
}));