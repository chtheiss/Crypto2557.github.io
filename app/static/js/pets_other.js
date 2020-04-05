// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {
        await load_all_pets(["pets_hard", "pets_other"]);

        $(".pet-input[type='number']").bind('change', function(evt) {
            evt.stopImmediatePropagation();
    		$pet_input = $(this)
    		if($pet_input.closest(".pet-card,.pet-card-other").first().data("origins").includes("shh")){
    				on_pet_input_change($pet_input, "pets_hard");
    		} else {
    			on_pet_input_change($pet_input, "pets_other");
    		}
        });
    });
}));