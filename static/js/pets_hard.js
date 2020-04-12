function calculatePetFragmentsToFarm() {
    let KL = parseInt($("#KL-number").val());
    let tickets = parseInt($("#tickets_hard-number").val()) + parseInt(3 * $("#refills_hard-number").val());
    let row = $("#dragable-row");

    clear_tracking();

    row.children().each(function() {
        let col = $(this);
        let possible_stages = [];
        let from_stage = [];
        let fragments = 0;
        let current_frags = 0;
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
                let add = 1;
                fragments += (tickets >= add) ? add : tickets;
                tickets -= (tickets >= add) ? add : tickets;
            }
        }
        tickets += (fragments > 330 - current_frags) ? fragments - (330 - current_frags) : 0;
        fragments = (fragments > 330 - current_frags) ? 330 - current_frags : fragments;
        frag_text = col.find("p");
        frag_text.text(fragments);

        let tracker = $(".pet-trackers").children('[data-empty="True"]').first();
        if (fragments > 0) {
            frag_text.removeClass('invisible');
            let days = Math.ceil((330 - current_frags) / fragments);
            tracker.css("display", "");
            tracker.find("img").attr("src", col.find(".pet-image").attr("src"));
            tracker.attr("data-empty", "False");
            tracker.data("empty", "False");
            tracker.find("p").text(days + " days");

        } else {
            frag_text.addClass('invisible');
        }
    });
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {
        let storage_name = "pets_hard";
        await load_all_pets([storage_name]);
        create_sortable(storage_name);

        $(".pet-input[type='number']").bind('change', function() {
            on_pet_input_change($(this), storage_name);
        });

        $("#reset-btn").click(async function(evt) {
            evt.stopImmediatePropagation();
            if (!$(this).hasClass("disabled")){
                $('#reset-btn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...').addClass('disabled');
                await reset_priority(storage_name);
                $('#reset-btn>span').remove();
                $('#reset-btn').removeClass('disabled');
                $('#reset-btn').text("Reset Priority");
            }
        });

        $("#add-all-btn").on("click", async function(evt) {
            evt.stopImmediatePropagation();
            if (!$(this).hasClass("disabled")){
                $('#add-all-btn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Calculating...').addClass('disabled');
                for (const pet of $(".pet-card")) {
                    let $pet = $(pet);
                    let frags_to_add = parseInt($pet.find(".pet-card-frags").text());
                    let input = $pet.find(".pet-input");
                    let current_frags = handle_nan(parseInt(input.val()));
                    if (frags_to_add > 0) {
                        input.val(current_frags + frags_to_add);
                        await on_pet_input_change($(input), storage_name);
                    }
                }
                $('#add-all-btn>span').remove();
                $('#add-all-btn').removeClass('disabled');
                $('#add-all-btn').text("Progress 1 Day");
            }
        });

        await sortPetsByPriority(storage_name);
        calculatePetFragmentsToFarm();
    });
}));