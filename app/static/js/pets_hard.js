function calculatePetFragmentsToFarm() {
  var KL = parseInt($("#KL-number").val());
  var tickets = parseInt($("#tickets_hard-number").val()) + parseInt(3 * $("#refills_hard-number").val());
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
      for (stage of from_stage) {
        current_frags = handle_nan(parseInt(col.find(".pet-input").val()));
        current_frags = (current_frags > 330) ? 330 : current_frags;
        if (current_frags == 330) {
          break;
        }
        if (tickets > 0) {
          var add = 1;
          fragments += (tickets >= add) ? add : tickets;
          tickets -= (tickets >= add) ? add : tickets;
        }
      }
      tickets += (fragments > 330 - current_frags) ? fragments - (330 - current_frags) : 0;
      fragments = (fragments > 330 - current_frags) ? 330 - current_frags : fragments;
      frag_text = col.find("p");
      frag_text.text(fragments);

      if (fragments > 0) {
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
      change_pet_input_on_page_load($(this), "pets_hard");
    });

    row = $("#dragable-row").get()[0];
    sortable = Sortable.create(row, {
      cursor: 'move',
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

        updatePriorities("pets_hard")
        calculatePetFragmentsToFarm()
      },
    });

    $(".pet-input[type='number']").bind('change', function() {
      on_pet_input_change($(this), "pets_hard")
    });

    $("#reset-btn").click(function() {
      getPriority(true).then(function(data) {
        var priority = data["priority"];
        for (p in priority) {
          col = $("#" + priority["" + p].replaceAll(" ", "_"));
          col.attr("data-id", p - 1);
          col.data("id", p - 1);
        }
        updatePriorities('pets_hard')
        sortPetsByPriority('pets_hard')
      });
    });

    sortPetsByPriority("pets_hard")
  });
}));