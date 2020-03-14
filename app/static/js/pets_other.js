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
        var hide = $('#hide-five-star-pets').prop("checked");

        var hard_tx = await db.transaction("pets_hard", 'readwrite');
        var store_hard = await hard_tx.objectStore("pets_hard");

        for (const pet of $(".pet-card-other")) {
            await load_pet(pet, store_hard, hide, kl.value);
        }

        var other_tx = await db.transaction("pets_other", 'readwrite');
        var store_other = await other_tx.objectStore("pets_other");

        for (const pet of $(".pet-card-other")) {
            await load_pet(pet, store_other, hide, kl.value);
        }

        $(".pet-input[type='number']").bind('change', function() {
        		$pet_input = $(this)
        		if($pet_input.closest(".pet-card,.pet-card-other").first().data("origins").includes("shh")){
        				on_pet_input_change($pet_input, "pets_hard");
        		} else {
        			on_pet_input_change($pet_input, "pets_other");
        		}
        });

        $(window).on('load', function() {
        	$(".pet-container-other").removeClass("hidden");
				});
    });
}));