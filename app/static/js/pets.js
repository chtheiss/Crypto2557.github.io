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
                remove_classes($img, ["pet-image", "one-star"]);
                $img.addClass("one-star"); 
            } else {
                 turn_star_off($("#"+val["name"].replace(" ", "_")+"-1star"));
                 remove_classes($img, ["pet-image", "zero-star"]);
                 $img.addClass("zero-star");
            }
            if(val["fragments"] >=30){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-2star"));
                remove_classes($img, ["pet-image", "two-star"]);
                $img.addClass("two-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "-")+"-2star"));
            }
            if(val["fragments"] >=80){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-3star"));
                remove_classes($img, ["pet-image", "three-star"]);
                $img.addClass("three-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "_")+"-3star"));
            }
            if(val["fragments"] >=180){ 
                turn_star_on($("#"+val["name"].replace(" ", "_")+"-4star"));
                remove_classes($img, ["pet-image", "four-star"]);
                $img.addClass("four-star"); 
            } else {
                turn_star_off($("#"+val["name"].replace(" ", "_")+"-4star"));
            }
            if(val["fragments"] >=330){ 
                turn_star_on($("#"+val["name"].replace(" ", "-")+"-5star"));
                remove_classes($img, ["pet-image", "five-star"]);
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
        var row = $("#dragable-row");
        if (row != undefined){

        $("#tracking").children().each(function(){
            var track_col = $(this);
            track_col.css("display", "none");
            track_col.find("img").attr("src", "");
            track_col.attr("data-empty", "True");
            track_col.data("empty", "True");
            track_col.find("p").text("");
        });
        row.children().each(function(){
            var col = $(this);
            var possible_stages = [];
            var from_stage = [];
            var fragments = 0;
            var current_frags = 0;
            col.find('.col-kl.col-green').each(function(){
                possible_stages.push(parseInt($(this).text()));
                from_stage.push(parseInt($(this).data("from")));
            });
            for (stage of from_stage){
                current_frags = handle_nan(parseInt(col.find(".pet-input").val()));
                if (current_frags >= 330){
                    break;
                }
                if (tickets > 0){
                    var add = 3;
                    if ((stage >= 296) && (stage % 5 != 0)){
                        add = 1;
                    }
                    fragments += (tickets >= add) ? add : tickets;
                    tickets -= (tickets >= add) ? add : tickets; 
                }
            }
            tickets += (fragments > 330-current_frags) ? fragments - (330-current_frags) : 0;
            fragments = (fragments > 330-current_frags) ? 330-current_frags : fragments;
            frag_text = col.find("p");
            frag_text.text(fragments);

            if (fragments > 0){
                frag_text.removeClass('zero-fragments');
                var days = Math.ceil((330 - current_frags) / fragments);
                var track_col = $('.col-2[data-empty="True"]').first();
                track_col.css("display", "");
                track_col.find("img").attr("src", col.find(".pet-image").attr("src"));
                track_col.attr("data-empty", "False");
                track_col.data("empty", "False");
                track_col.find("p").text(days + " days");
                track_col.parent(".justify-content-center").css("display", "");

            } else {
                frag_text.addClass('zero-fragments');
                var track_col = $('.col-2[data-empty="True"]').first();
                if (track_col.attr("id") == "track-1"){
                    track_col.parent(".justify-content-center").css("display", "none");
                }
            }
        });
        }
    }

    function getPriority(petid) {
        return $.ajax({
            type: "GET",
            url: Flask.url_for("core.get_priority"),
            dataType: "json",
            async: true
        });
    }

    function updatePriorities(){
        $("#dragable-row").children().each(function(){
            request = idb.open('endless-farming-db');
            col = $(this);
            val = {name: col.attr("id"), 
                    fragments: parseInt(col.find(".pet-input").val()),
                    priority: parseInt(col.attr("data-id"))}
            request.then(function(db){
                var tx = db.transaction('pets', 'readwrite');
                var store = tx.objectStore('pets');
                store.put(this);
            }.bind(val)); 
        });
    }

    function sortPetsByPriority(){
        request = idb.open('endless-farming-db');
        request.then(function(db){
            var tx = db.transaction('pets', 'readwrite');
            var store = tx.objectStore('pets');
            var items = store.getAll();
            items.then(function(items){
                for(item of items){
                    $("#"+item["name"]).attr("data-id", item["priority"]);
                    $("#"+item["name"]).data("id", item["priority"]);
                }
                var listitems = $("#dragable-row").children('.block').get();
                listitems.sort(function(a, b) {
                    var compA = parseFloat($(a).data('id'));
                    var compB = parseFloat($(b).data('id'));
                    return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
                });
                var $superrow = $('#dragable-row');
                $.each(listitems, function(idx, itm) {
                    $superrow.append(itm);
                });
                $("#dragable-row").removeClass("row-hidden");
                calculatePetFragmentsToFarm()
            });                
        });
    }

    function updateStages(kl){
        $(".col-kl").each(function(){
            var col = $(this);
            if(kl>=parseFloat(col.text())){
                col.removeClass('col-red');
                col.addClass('col-green');
            }else{
                col.removeClass('col-green');
                col.addClass('col-red');                
            }
        });
    }