function calculatePetFragmentsToFarm() {
  var KL = parseInt($("#KL-number").val());
  var tickets = parseInt($("#tickets-number").val()) + parseInt(5 * $("#refills-number").val());
  var row = $("#dragable-row");
  if (row != undefined) {

    clear_tracking();

    row.children().each(function() {
      var col = $(this);
      var possible_stages = [];
      var from_stage = [];
      var fragments = 0;
      var current_frags = 0;
      col.find('.col-kl.col-green').each(function() {
        possible_stages.push(parseInt($(this).text()));
        from_stage.push(parseInt($(this).data("from")));
      });
      var first_possible_stage = true;
      for (let stage of from_stage) {
        current_frags = handle_nan(parseInt(col.find(".pet-input").val()));
        current_frags = (current_frags > 330) ? 330 : current_frags;
        if (current_frags == 330) {
          break;
        }
        if (tickets > 0) {
          var add = 3;
          if ((stage >= 296) && (stage % 5 != 0)) {
            add = 1;
            first_possible_stage = false;
          } else if (first_possible_stage){
            add = 4;
            first_possible_stage = false;
          }
          fragments += (tickets >= add) ? add : tickets;
          tickets -= (tickets >= add) ? add : tickets;
        }
      }
      tickets += (fragments > 330 - current_frags) ? fragments - (330 - current_frags) : 0;
      fragments = (fragments > 330 - current_frags) ? 330 - current_frags : fragments;
      frag_text = col.find("p");
      frag_text.text(fragments);

      var track_col = $('.col-2[data-empty="True"]').first();

      if (fragments > 0) {
        frag_text.removeClass('zero-fragments');
        var days = Math.ceil((330 - current_frags) / fragments);
        track_col.css("display", "");
        track_col.find("img").attr("src", col.find(".pet-image").attr("src"));
        track_col.attr("data-empty", "False");
        track_col.data("empty", "False");
        track_col.find("p").text(days + " days");
        track_col.parent(".justify-content-center").css("display", "");

      } else {
        frag_text.addClass('zero-fragments');
        if (track_col.attr("id") == "track-1") {
          track_col.parent(".justify-content-center").css("display", "none");
        }
      }
    });
  }
}

// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

  yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

  $(function() {

    $(".pet-input[type='number']").each(function() {
      change_pet_input_on_page_load($(this), "pets");
    });

    row = $("#dragable-row").get()[0];
    sortable = Sortable.create(row, {
      cursor: 'move',
      filter: 'input',
      animation: 150,
      onUpdate: function(event) {
        change = $("#dragable-row").children().filter(function() {
          id = parseInt($(this).attr("data-id"));
          if (event.newIndex < event.oldIndex) {
            return id >= event.newIndex && id <= event.oldIndex;
          } else {
            return id >= event.oldIndex && id <= event.newIndex;
          }

        });

        change.each(function() {
          var $col = $(this);
          if (event.newIndex < event.oldIndex) {
            $col.attr("data-id", parseInt($col.attr("data-id")) + 1);
            $col.data("id", parseInt($col.attr("id")) + 1);
          } else {
            $col.attr("data-id", parseInt($col.attr("data-id")) - 1);
            $col.data("id", parseInt($col.attr("id")) - 1);
          }
        });

        $(event.item).attr("data-id", event.newIndex);
        $(event.item).data("id", event.newIndex);

        updatePriorities("pets");
        calculatePetFragmentsToFarm();
      },
    });

    $(".pet-input[type='number']").bind('change', function() {
      on_pet_input_change($(this), "pets");
    });

    $("#reset-btn").click(function() {
      getPriority(false).then(function(data) {
        var priority = data.priority;
        for (let p in priority) {
          col = $("#" + priority["" + p].replaceAll(" ", "_"));
          col.attr("data-id", p - 1);
          col.data("id", p - 1);
        }
        updatePriorities('pets');
        sortPetsByPriority('pets');
      });
    });

    sortPetsByPriority('pets');
  });
}));
