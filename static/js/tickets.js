(function(yourcode) {

    yourcode(window.jQuery, window.indexedDB, window, document);

}(function($, indexedDB, window, document) {

    $(async function() {
        for (const progress of $(".ticket-row-progress")) {
            $this = $(progress);
            let db = await idb.open('endless-farming-db')
            let tx = await db.transaction('units', 'readwrite');
            let store = await tx.objectStore('units');
            let unit = $this.data("unit").replaceAll(" ", "_")
            let val = await store.get(unit);
            let progressbar = $this.find(".progress-bar");
            let requirement = progressbar.attr('aria-valuemax');

            let value = 0;
            let val_text = 0;
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