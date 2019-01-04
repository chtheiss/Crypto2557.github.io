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
		handle_nan(parseInt($progress_bar.attr("aria-valuemax"))));
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
			$unit_cell = $("#"+unit.replace(" ", "-"));
			other_unit_values=get_unit_input_values($unit_cell.find("input").first())
	    	val += other_unit_values.nsr;
	    	val_sr += other_unit_values.sr;
	    	additional_bars_to_update=$unit_cell.find(
	    		".progress-bar[data-linked-units*='"+$input.data("unit").replace("-"," ")+"']");
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
		url: Flask.url_for("core.get_pet", {"petid": petid.replace("-", "_")}),
		dataType: "json"
	});
}

function getUnit(unitid) {
	return $.ajax({
		type: "GET",
		url: Flask.url_for("core.get_unit", {"unit": unitid.replace("-", "_")}),
		dataType: "json"
	});
}