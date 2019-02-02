function turn_star_on($image_checkbox) {
  var $checkbox = $image_checkbox.find('input[type="checkbox"]');
  var $image = $image_checkbox.find('.img-responsive');
  $checkbox.prop("checked", true);
  $image.attr("src", "../static/img/star.png");
}

function turn_star_off($image_checkbox) {
  var $checkbox = $image_checkbox.find('input[type="checkbox"]');
  var $image = $image_checkbox.find('.img-responsive');
  $checkbox.prop("checked", false);
  $image.attr("src", "../static/img/stargrey.png");
}

function change_stars(val) {
  if (val != undefined) {
    var $img = $("#" + val["name"].replace(" ", "_") + "-image");
    if (val["fragments"] >= 10) {
      turn_star_on($("#" + val["name"].replace(" ", "_") + "-1star"));
      remove_classes($img, ["pet-image", "one-star"]);
      $img.addClass("one-star");
    } else {
      turn_star_off($("#" + val["name"].replace(" ", "_") + "-1star"));
      remove_classes($img, ["pet-image", "zero-star"]);
      $img.addClass("zero-star");
    }
    if (val["fragments"] >= 30) {
      turn_star_on($("#" + val["name"].replace(" ", "_") + "-2star"));
      remove_classes($img, ["pet-image", "two-star"]);
      $img.addClass("two-star");
    } else {
      turn_star_off($("#" + val["name"].replace(" ", "-") + "-2star"));
    }
    if (val["fragments"] >= 80) {
      turn_star_on($("#" + val["name"].replace(" ", "_") + "-3star"));
      remove_classes($img, ["pet-image", "three-star"]);
      $img.addClass("three-star");
    } else {
      turn_star_off($("#" + val["name"].replace(" ", "_") + "-3star"));
    }
    if (val["fragments"] >= 180) {
      turn_star_on($("#" + val["name"].replace(" ", "_") + "-4star"));
      remove_classes($img, ["pet-image", "four-star"]);
      $img.addClass("four-star");
    } else {
      turn_star_off($("#" + val["name"].replace(" ", "_") + "-4star"));
    }
    if (val["fragments"] >= 330) {
      turn_star_on($("#" + val["name"].replace(" ", "-") + "-5star"));
      remove_classes($img, ["pet-image", "five-star"]);
      $img.addClass("five-star");
    } else {
      turn_star_off($("#" + val["name"].replace(" ", "_") + "-5star"));
    }
  }
}

function remove_classes($element, classes_not_to_remove) {
  var classes = $($element).attr('class').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    if (classes_not_to_remove.includes(classes[i]))
      continue;
    $element.removeClass(classes[i]);
  }
  var classes = $($element).attr('class').split(/\s+/);
}

function updateStages(kl) {
  $(".col-kl").each(function() {
    var col = $(this);
    if (kl >= parseFloat(col.text())) {
      col.removeClass('col-red');
      col.addClass('col-green');
    } else {
      col.removeClass('col-green');
      col.addClass('col-red');
    }
  });
}

function getPriority(hard) {
  var url = ""
  if (hard){
    url = "core.get_hard_sh_priority";
  } else {
    url = "core.get_priority";
  }
  return $.ajax({
    type: "GET",
    url: Flask.url_for(url),
    dataType: "json",
    async: true
  });
}

function change_pet_input_on_page_load($pet_input, storage_name) {
  idb.open('endless-farming-db').then(function(db) {
    var tx = db.transaction(storage_name, 'readwrite');
    var store = tx.objectStore(storage_name);
    return store.get($pet_input.data("pet"));
  }.bind($pet_input)).then(function(val) {
    if (val != undefined) {
      $pet_input.val(val["fragments"]);
    }
    change_stars(val);
  }.bind($pet_input));
}

function sortPetsByPriority(storage_name) {
  request = idb.open('endless-farming-db');
  request.then(function(db) {
    var tx = db.transaction(storage_name, 'readwrite');
    var store = tx.objectStore(storage_name);
    var items = store.getAll();
    items.then(function(items) {
      for (item of items) {
        $("#" + item["name"]).attr("data-id", item["priority"]);
        $("#" + item["name"]).data("id", item["priority"]);
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

function updatePriorities(storage_name) {
  $("#dragable-row").children().each(function() {
    request = idb.open('endless-farming-db');
    col = $(this);
    val = {
      name: col.attr("id"),
      fragments: parseInt(col.find(".pet-input").val()),
      priority: parseInt(col.attr("data-id"))
    }
    request.then(function(db) {
      var tx = db.transaction(storage_name, 'readwrite');
      var store = tx.objectStore(storage_name);
      store.put(this);
    }.bind(val));
  });
}

function on_pet_input_change($pet_input, storage_name){
   var request = idb.open('endless-farming-db');
      request.then(function(db) {
        var tx = db.transaction(storage_name, 'readwrite');
        var store = tx.objectStore(storage_name);
        var item = {
          name: this.data("pet"),
          fragments: parseInt(this.val()),
          priority: parseInt(this.parents(".block").attr("data-id"))
        };
        var putRequest = store.put(item);
        return tx.complete;
      }.bind($pet_input)).then(function() {
        val = idb.open('endless-farming-db').then(function(db) {
          var tx = db.transaction(storage_name, 'readwrite');
          var store = tx.objectStore(storage_name);
          return store.get(this.data("pet"));
        }.bind(this)).then(function(val) {
          this.val(val["fragments"]);
          change_stars(val);
          calculatePetFragmentsToFarm();
        }.bind($pet_input));
      }.bind($pet_input));
}

function clear_tracking(){
  $("#tracking").children().each(function() {
    var track_col = $(this);
    track_col.css("display", "none");
    track_col.find("img").attr("src", "");
    track_col.attr("data-empty", "True");
    track_col.data("empty", "True");
    track_col.find("p").text("");
  });
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

  yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

  $(function() {
    $(".pet-input[type='number']").inputSpinner();

    $(".image-checkbox").on("click", function(e) {
      var $checkbox = $(this).find('input[type="checkbox"]');
      var $input = $("#" + $(this).data("pet") + "-fragments");
      $input.val($checkbox.attr("value"));
      $input.change();
    });

    $("#add-all-btn").click(function() {
      $("#dragable-row").children('.block').each(function() {
        var col = $(this);
        var frags_to_add = parseInt(col.find(".col-fragments p").text());
        var input = col.find(".pet-input");
        var current_frags = handle_nan(parseInt(input.val()));
        if (frags_to_add > 0){
          input.val(current_frags + frags_to_add);
          input.change();
        }
      });
    });

    request = idb.open('endless-farming-db');
    request.then(function(db) {
      var tx = db.transaction('player', 'readwrite');
      var store = tx.objectStore('player');
      var KL = store.get("KL");
      KL.then(function(val) {
        if (val !== undefined) {
          updateStages(val["value"]);
        }
      });
    });
  })
}));