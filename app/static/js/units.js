function change_progress_bar_value($bar, value, max){
	let siz = (value/max*100).toFixed(2);
	$bar.css("width", siz + "%")
		.attr("aria-valuenow", value)
		.text(Number((value).toFixed(2))+"/"+max);
	if(siz >=100){
		$bar.addClass("progress-bar-green");
		$bar.removeClass("progress-bar-red");
	} else {
		$bar.addClass("progress-bar-red");
		$bar.removeClass("progress-bar-green");
	}
}

function update_progress_bar_values($progress_bar, buff){
	$progress_bar
		.attr("aria-valuemax", buff["requirement"])
		.text($progress_bar.attr("aria-valuenow")+"/"+$progress_bar.attr("aria-valuemax"));
	change_progress_bar_value($progress_bar, 
		handle_nan(parseFloat($progress_bar.attr("aria-valuenow"))), 
		handle_nan(parseFloat($progress_bar.attr("aria-valuemax"))));
}

function get_unit_input_values($input){
	var val = 0;
	var val_sr = 0;
	if($input.attr("id").endsWith("-sr")){
		val_sr += handle_nan(parseInt($input.val()));
		val += handle_nan(parseInt($("#"+$input.attr("id").replace("-sr", "")).val()));
	} else {
		val_sr += handle_nan(parseInt($("#"+$input.attr("id")+"-sr").val()));
		val += handle_nan(parseInt($input.val()));
	}
	return {nsr: val, sr: val_sr}	
}

function update_progress_bar($bar, $input){
	var unit_values = get_unit_input_values($input);
	var val = unit_values.nsr;
	var val_sr = unit_values.sr;
	var multiplier = parseFloat($bar.data("multiplier"));
	var linked_units = $bar.data("linked-units");
	var additional_bars_to_update = [];
	if(linked_units != ""){
		linked_units = linked_units.replace("]", "").replace("[", "").replaceAll("'", "").split(',');
		linked_units.forEach(function(part, index, linked_units) {
  			linked_units[index] = linked_units[index].trim();
		});
		for (var unit of linked_units){
			$unit_cell = $("#"+unit.replace(" ", "_"));
			other_unit_values=get_unit_input_values($unit_cell.find("input").first());
	    	val += other_unit_values.nsr;
	    	val_sr += other_unit_values.sr;
	    	for (add_buff of $unit_cell.find(
	    		".progress-bar[data-linked-units*='"+$input.data("unit").replace("_"," ")+"']")){
	    		additional_bars_to_update.push(add_buff);
	    	}
	    }        
	}
	var current_progress = multiplier*val+val_sr;
	var max = $bar.attr("aria-valuemax");
	change_progress_bar_value($bar, current_progress, max);
	for (var add_bar of additional_bars_to_update){
		change_progress_bar_value($(add_bar), current_progress, $(add_bar).attr("aria-valuemax"));
	}
}

function on_unit_input_change($unit_input){
	idb.open('endless-farming-db', 1).then(function(db){
		var tx = db.transaction('units', 'readwrite');
		var store = tx.objectStore('units');
		return store.get($unit_input.data("unit"));
	}.bind($unit_input)).then(function(val) {
		if(val != undefined){
			if ($unit_input.attr("id").endsWith("-sr")){
				$unit_input.attr("value", val["sr"]);
			} else {
				$unit_input.attr("value", val["nsr"]);
			}
			update_all_progress_bars_of_input($unit_input);
		}      
	}.bind($unit_input));
}

function update_all_progress_bars_of_input($input){
	$unit_cell = $("#"+$input.data("unit"));
	for (bar of $unit_cell.find('[role="progressbar"]')){
		update_progress_bar($(bar), $input);
	}
}

function getPet(petid) {
	return $.ajax({
		type: "GET",
		url: Flask.url_for("core.get_pet", {"petid": petid}),
		dataType: "json",
		async: true
	});
}

function getUnit(unitid) {
	return $.ajax({
		type: "GET",
		url: Flask.url_for("core.get_unit", {"unit": unitid}),
		dataType: "json",
		async: true
	});
}

function getLinkedActivePets(buff, items){
	linked_active_pets = []
	for (item of items){
        if(item["fragments"]>=330 && buff["linked_pets"].includes(item["name"].replace("_", " "))){
            linked_active_pets.push(item["name"]);
        }
    }
    return linked_active_pets;
}

function updateBuffRequirement(buff, data){
        idb.open('endless-farming-db', 1).then(function(db){
            var tx = db.transaction('pets', 'readwrite');
            var store = tx.objectStore('pets');
            return store.getAll();
        }).then(function(items){
            linked_active_pets = getLinkedActivePets(this, items);
            this["requirement"] = this["requirement"][linked_active_pets.length];
            $progbar = $("#"+data["petid"]+"-image").parents(".block").find('[data-original-title="'+this['name']+'"]').find(".progress-bar")
            update_progress_bar_values($progbar, this);
        }.bind(buff));  
}

async function updateBuffs($petImage){
    var db = await idb.open('endless-farming-db', 1)
    var tx = await db.transaction('pets', 'readwrite');
    var store = tx.objectStore('pets');
    var items = await store.getAll();
    var pet = await store.get( $petImage.data("pet"));
    if(pet != undefined && pet["fragments"]>=330){
    	$petImage.addClass("five-star-pet");
    	data = getPet($petImage.data("pet")).then(async function(data){
    		console.log(this["pet"]);
    		console.log(data);
    		$unit_cell = $("#"+$petImage.data("unit"));
    		$prog_bar_add_buff = $unit_cell.find(".additional_buff");   
    		$prog_bar_add_buff.removeClass("progress-bar-hidden");
   			$prog_bar_add_buff.parent().popover();
   			for (buff of data["pet"]["buffs"]){
        		$buff_span = $unit_cell.find('[data-original-title="'+buff['name']+'"]');
        		$buff_span.attr("data-content", buff["description"]);
        		if (buff["linked_pets"] == undefined){
        			update_progress_bar_values($buff_span.find(".progress-bar"), buff);
        		} else {
            		linked_active_pets = getLinkedActivePets(buff, items);
            		await updateBuffRequirement(buff, data);
            		/*
 getPet(linked_pet).done(function(data){
                                                linked_pet_buffs = data["pet"]["buffs"];
                                                console.log(data["pet"]);
                                                for (linked_pet_buff of linked_pet_buffs){
                                                    if (linked_pet_buff["name"] == this["b"]["name"]){
                                                        linked_pet_buff["requirement"] = linked_pet_buff["requirement"][getLinkedActivePets(linked_pet_buff, items).length];
                                                        console.log(data["petid"]);
                                                        console.log(linked_pet_buff);
                                                        console.log($("#"+data["petid"]+"-image").parents(".block").find('[data-original-title="'+linked_pet_buff['name']+'"]').find(".progress-bar"));
                                                        update_progress_bar_values($("#"+data["petid"].replace(" ", "_")+"-image").parents(".block").find('[data-original-title="'+linked_pet_buff['name']+'"]').find(".progress-bar"), linked_pet_buff);
                                                    }
                                                }
                                            }.bind(this));
                     */
        		}
    		}
    	}.bind({"pet": pet, "items": items}));
    }
}

async function getItems(){
	items = await idb.open('endless-farming-db', 1).then(function(db){
       var tx = db.transaction('pets', 'readwrite');
       var store = tx.objectStore('pets');
       return store.getAll();
    }).then(await function (data) {
    	return data;
    });
    console.log(items);
	return items
}