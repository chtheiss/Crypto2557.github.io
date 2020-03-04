function change_progress_bar_value($bar, value, max) {
  var siz = (value / max * 100).toFixed(2);
  $bar.css("width", siz + "%")
    .attr("aria-valuenow", value)
    .text(Number((value).toFixed(2)) + "/" + max);
  if (siz >= 100) {
    $bar.css("background-color", "#1ca51c");
  } else {
    $bar.css("background-color", "#ce2323");
  }
}

function update_progress_bar_values($progress_bar, buff){
  $progress_bar
    .attr("aria-valuemax", buff.requirement)
    .text($progress_bar.attr("aria-valuenow")+"/"+$progress_bar.attr("aria-valuemax"))
    .attr("data-multiplier", buff.multiplier)
    .data("multiplier", buff.multiplier);
  if (buff.linked_units != undefined){
    $progress_bar.attr("data-linked-units", buff.linked_units.toString())
      .data("linked-units", buff.linked_units.toString());
  }
  if (buff.linked_multiplier != undefined){
    $progress_bar.attr("data-linked-multiplier", buff.linked_multiplier.toString())
      .data("linked-multiplier", buff.linked_multiplier.toString());
  }
  update_progress_bar($progress_bar, $progress_bar.parents(".unit-card").find(".unit-input[type='number']").first());
}

function get_unit_input_values($input) {
  var val = 0;
  var val_sr = 0;
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

function update_progress_bar($bar, $input){

  var unit_values = get_unit_input_values($input);
  var multiplier = parseFloat($bar.attr("data-multiplier"));

  var linked_units = $bar.data("linked-units");
  var val_linked = 0;
  var val_sr_linked = 0;
  var additional_bars_to_update = [];

  if(linked_units != ""){
    linked_units = linked_units.replace("]", "").replace("[", "").replaceAll("'", "").split(',');
    linked_units.forEach(function(part, index, linked_units) {
        linked_units[index] = linked_units[index].trim().replaceAll(" ", "_");
    });
    var linked_multiplier = ($bar.attr("data-linked-multiplier") == undefined) ?
      Array(linked_units.length).fill().map(function(){return 1.0}) :
      $bar.attr("data-linked-multiplier").replace("]", "").replace("[", "").replace(" ", "").split(",").map(Number);
    var i = 0;
    for (let unit of linked_units){
      var $unit_cell = $("#"+unit.replace(" ", "_"));
      var other_unit_values = get_unit_input_values($unit_cell.find(".unit-input[type='number']").first());
          val_linked += linked_multiplier[i]*other_unit_values.nsr;
          val_sr_linked += linked_multiplier[i]*other_unit_values.sr;
        for (let add_buff of $unit_cell.find(
          ".progress-bar[data-linked-units*='"+$input.data("unit").replace("_"," ")+"']")){
          additional_bars_to_update.push(add_buff);
        }

        i += 1;
      }
  }
  var current_progress = multiplier*unit_values.nsr + unit_values.sr + (multiplier*val_linked + val_sr_linked);
  var max = $bar.attr("aria-valuemax");
  change_progress_bar_value($bar, current_progress, max);

  for (let add_bar of additional_bars_to_update){
    var $add_bar = $(add_bar);
     if($add_bar.attr("data-linked-multiplier").replace("]", "").replace("[", "").replace(" ", "").split(",").map(Number).every( v => v === 1.0 )){
      var _current_progress = current_progress;
      change_progress_bar_value($(add_bar), _current_progress, $(add_bar).attr("aria-valuemax"));
    } else {
      if ($add_bar.parents("unit-card").attr("id") == linked_units[0].replaceAll(" ", "_") &&
      $bar.parents(".unit-card").find(".pet-image.five-star-pet").length > 0){
        var linked_multiplier = $add_bar.attr("data-linked-multiplier").replace("]", "").replace("[", "").replace(" ", "").split(",").map(Number);
        var other_unit_values = get_unit_input_values($add_bar.parents(".unit-card").find(".unit-input[type='number']").first());
        var _current_progress = multiplier*other_unit_values.nsr + other_unit_values.sr + linked_multiplier[linked_multiplier.length-1]*(multiplier*unit_values.nsr + unit_values.sr);
        change_progress_bar_value($(add_bar), _current_progress, $(add_bar).attr("aria-valuemax"));
    }
    }
  }
}


async function load_input_value($unit_input) {
  db = await idb.open('endless-farming-db');
  var tx = await db.transaction('units', 'readwrite');
  var store = await tx.objectStore('units');
  var val = await store.get($unit_input.data("unit"));

  if (val != undefined) {
    if ($unit_input.attr("id").endsWith("-sr")) {
      $unit_input.val(val.sr);
    } else {
      $unit_input.val(val.nsr);
    }
    update_all_progress_bars_of_input($unit_input);
  }
}

function update_all_progress_bars_of_input($input) {
  var $unit_cell = $("#" + $input.data("unit"));
  for (const bar of $unit_cell.find('[role="progressbar"]')) {
    update_progress_bar($(bar), $input);
  }
}

function getPets() {
  return $.ajax({
    type: "GET",
    url: Flask.url_for("core.get_pets"),
    dataType: "json",
    async: true
  });
}

function getUnits() {
  return $.ajax({
    type: "GET",
    url: Flask.url_for("core.get_units"),
    dataType: "json",
    async: true
  });
}

function getLinkedActivePets(buff, pets) {
  var linked_active_pets = [];
  if(buff.linked_pets != undefined){
    linked_active_pets = pets.filter(pet => pet.fragments >=330 &
       buff.linked_pets.includes(pet.name.replace("_", " ")))
  }
  return linked_active_pets;
}

function updateBuffRequirement($unit_card, buff, id, pets) {
  var linked_active_pets = getLinkedActivePets(buff, pets);
  if(Array.isArray(buff.requirement)){
    buff.requirement = buff.requirement[linked_active_pets.length];
    var $progbar = $unit_card.find('[title="' + buff.name + '"]').find(".progress-bar");
    update_progress_bar_values($progbar, buff);
  }
}

function showAdditionalBuffProgressBars($unit_card){
  var $prog_bar_add_buff = $unit_card.find(".additional_buff");
  $prog_bar_add_buff.removeClass("progress-bar-hidden");
  $prog_bar_add_buff.parent().popover();
}

(function(yourcode) {

  yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

  $(async function() {

    $(".unit-input[type='number']").inputSpinner();

    $(".modal").on('shown.bs.modal', function(e) {
      var tab = e.relatedTarget.hash;
      $('.nav-tabs a[href="'+tab+'"]').tab('show');
    });

    db = await idb.open("endless-farming-db")
    var tx = await db.transaction('pets', 'readwrite');
    var store = await tx.objectStore('pets');
    var pets = await store.getAll();

    var pets_info = await getPets()
    var units_info = await getUnits()

    console.log(pets_info)

    for (const unit_card of $('.unit-card')){
      $unit_card = $(unit_card);
      // updates all progress bars
      for (let bar of $unit_card.find('[role="progressbar"]')) {
        for (let input of $unit_card.find(".unit-input[type='number']")) {
          update_progress_bar($(bar), $(input));
        }
      }

      unit_name = unit_card.id.replaceAll("_", " ")
      unit = units_info[unit_name]

      // Change Unit card if own pet is 5*
      $pet_image = $unit_card.find('.pet-image')
      pet_name = $pet_image.data("pet")
      five_star_pet = pets.filter(pet => pet.name == pet_name & pet.fragments >= 330)
      if(five_star_pet.length){
        // Highlight pet
        $pet_image.addClass("five-star-pet");
        // Add additional buffs
        showAdditionalBuffProgressBars($unit_card)
        // Change buff descriptions
        for(buff of unit.buffs){
          var $buff_span = $unit_card.find('[data-title="' + buff.name + '"]');
          $buff_span.attr("data-content", buff["description"]);
        }
      }
      // Update Buff Progressbar based on the active linked pets
      for(let buff of unit.buffs){
        updateBuffRequirement($unit_card , buff, unit_name, pets);
        if(buff.linked_units != undefined){
          pet_buff = pets_info[units_info[unit_name].pet].buffs.filter(pet_buff => pet_buff.name == buff.name)
          linked_units_with_active_pet = buff.linked_units.filter(
            linked_unit => pets.filter(
              pet => pet.name == units_info[linked_unit].pet && pet.fragments >= 330
            ).length > 0
          )
          var req = five_star_pet.length+linked_units_with_active_pet.length
          if(req != 0){
            if(five_star_pet && pet_buff.length > 0){
              buff = pet_buff[0]
            }
            if(Array.isArray(buff.requirement)){
              buff.requirement = pet_buff[0].requirement[req-1]
              var $progbar = $unit_card.find('[title="' + buff.name + '"]').find(".progress-bar");
              update_progress_bar_values($progbar, buff);
            }
          }
        }
      }
    }

    $(".unit-input[type='number']").bind('change', async function() {
      $this = $(this);
      update_all_progress_bars_of_input($this);
      db = await idb.open('endless-farming-db')
      var tx = await db.transaction('units', 'readwrite');
      var store = await tx.objectStore('units');
      unit_values = get_unit_input_values($this);
      var item = {
        name: $this.data("unit"),
        nsr: unit_values.nsr,
        sr: unit_values.sr
      };
      store.put(item);
    });

    for (const unit_input of $(".unit-input[type='number']")){
      load_input_value($(unit_input));
    }

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').each(function() {
      prog_bar = $(this).children().first();
      if (!$(prog_bar).attr('class').split(/\s+/).includes("progress-bar-hidden")) {
        $(this).popover();
      }
    });
  });
}));