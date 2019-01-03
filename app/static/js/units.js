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

function update_progress_bar($bar, $input){
	var val = 0;
	var val_sr = 0;
	if($input.attr("id").endsWith("-sr")){
		val_sr += handle_nan(parseInt($input.val()));
		val += handle_nan(parseInt($("#"+$input.attr("id").replace("-sr", "")).val()));
	} else {
		val_sr += handle_nan(parseInt($("#"+$input.attr("id")+"-sr").val()));
		val += handle_nan(parseInt($input.val()));
	}
	var multiplier = parseFloat($bar.data("multiplier"));
	var linked_units = $bar.data("linked-units");
	var additional_bars_to_update = [];
	var current_progress = multiplier*val+val_sr;
	var max = $bar.attr("aria-valuemax");
	change_progress_bar_value($bar, current_progress, max);
	for (var add_bar of additional_bars_to_update){
		change_progress_bar_value(add_bar, current_progress, max);
	}
}

function getPet(petid) {
	return $.ajax({
		type: "GET",
		url: "/pet-"+petid,
		dataType: "json"
	});
}

function getUnit(unitid) {
	return $.ajax({
		type: "GET",
		url: "/unit-"+unitid,
		dataType: "json"
	});
}