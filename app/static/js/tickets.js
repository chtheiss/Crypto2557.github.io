(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {
        for (const progress of $(".ticket-row-progress")) {
            $this = $(progress);
            var db = await idb.open('endless-farming-db')
            var tx = await db.transaction('units', 'readwrite');
            var store = await tx.objectStore('units');
            let unit = $this.data("unit").replaceAll(" ", "_")
            var val = await store.get(unit);
            var progressbar = $this.find(".progress-bar");
            var requirement = progressbar.attr('aria-valuemax');

            var value = 0;
            var val_text = 0;
            if (val != undefined) {
                value = 100 * ((val.nsr + val.sr) / parseFloat(requirement));
                val_text = val.nsr + val.sr;
            }
            value = Math.min(100, value)
            progressbar.css("width", value + "%");
            if (value >= 100) {
                progressbar.css("background-color", "#1ca51c");
            } else {
                progressbar.css("background-color", "#ce2323");
            }

            progressbar.text(val_text + "/" + requirement);

        }
    });
}));