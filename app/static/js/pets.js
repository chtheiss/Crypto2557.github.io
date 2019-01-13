    function turn_star_on($image_checkbox){
        var $checkbox = $image_checkbox.find('input[type="checkbox"]');
        var $image = $image_checkbox.find('.img-responsive');
        $checkbox.prop("checked", true);
        $image.attr("src", "../static/img/star.png");
    }

    function turn_star_off($image_checkbox){
        var $checkbox = $image_checkbox.find('input[type="checkbox"]');
        var $image = $image_checkbox.find('.img-responsive');
        $checkbox.prop("checked", false);
        $image.attr("src", "../static/img/stargrey.png");
    }

    function remove_classes($element, classes_not_to_remove){
        var classes = $($element).attr('class').split(/\s+/);
        for(var i=0;i<classes.length;i++){
            if(classes_not_to_remove.includes(classes[i]))
                continue;
            $element.removeClass(classes[i]);
        }
        var classes = $($element).attr('class').split(/\s+/);
    }

    function change_stars(val){
        if(val != undefined){
            var $img = $("#"+val["name"].replace(" ", "_")+"-image");
            if(val["fragments"] >=10){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-1star"));
                remove_classes($img, ["unit-image", "one-star"]);
                $img.addClass("one-star"); 
            } else {
                 turn_star_off($("#"+val["name"].replace(" ", "_")+"-1star"));
                 remove_classes($img, ["unit-image", "zero-star"]);
                 $img.addClass("zero-star");
            }
            if(val["fragments"] >=30){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-2star"));
                remove_classes($img, ["unit-image", "two-star"]);
                $img.addClass("two-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "-")+"-2star"));
            }
            if(val["fragments"] >=80){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-3star"));
                remove_classes($img, ["unit-image", "three-star"]);
                $img.addClass("three-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "_")+"-3star"));
            }
            if(val["fragments"] >=180){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-4star"));
                remove_classes($img, ["unit-image", "four-star"]);
                $img.addClass("four-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "_")+"-4star"));
            }
            if(val["fragments"] >=330){ 
                turn_star_on($("#"+val["name"].replace(" ", "-")+"-5star"));
                remove_classes($img, ["unit-image", "five-star"]);
                $img.addClass("five-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "_")+"-5star"));
            }
        } 
    }

    function on_pet_input_change($pet_input){
        idb.open('endless-farming-db').then(function(db){
            var tx = db.transaction('pets', 'readwrite');
            var store = tx.objectStore('pets');
            return store.get($pet_input.data("pet"));
        }.bind($pet_input)).then(function(val) {
            if(val != undefined){
                $pet_input.attr("value", val["fragments"]);
            }      
            change_stars(val);
        }.bind($pet_input));
    }

    function calculatePetFragmentsToFarm(){
        var KL = parseInt($("#KL-number").val());
        var tickets = parseInt($("#tickets-number").val()) + parseInt(5*$("#refills-number").val());
        console.log(KL);
        console.log(tickets);
        $("#dragable-row").children().each(function(){
            var col = $(this);
            var possible_stages = [];
            var fragments = 0;
            col.find('.col-kl.col-green').each(function(){
                possible_stages.push(parseInt($(this).text()));
            });
            for (stage of possible_stages){
                if (tickets >= 3){
                    fragments += 3;
                    tickets -= 3; 
                }
            }
            frag_text = col.find("p");
            frag_text.text(fragments);
            if (fragments > 0){
                frag_text.removeClass('zero-fragments');
            } else {
                frag_text.addClass('zero-fragments');
            }
        });
    }

    function getPriority(petid) {
        return $.ajax({
            type: "GET",
            url: Flask.url_for("core.get_priority"),
            dataType: "json",
            async: true
        });
}