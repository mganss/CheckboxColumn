var columnHandler = {
    iEditable: function (row, col) {
        return false;
    },
    getCellProperties: function (row, col, props) {
        return "selectCol";
    },
    getImageSrc: function (row, col) {
        return null;
    },
    getCellText: function (row, col) {
        return "";
    },
    cycleCell: function (row, col) {
        var selection = col.columns.tree.view.selection;
        selection.toggleSelect(row);
    },
    isString: function () {
        return false;
    },
    getSortLongForRow: function (hdr) {
        return 0;
    }
}

var prefObserver = {
    register: function () {
        // First we'll need the preference services to look for preferences.
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService);

        // For this.branch we ask for the preferences for extensions.myextension. and children
        this.branch = prefService.getBranch("extensions.checkbox.");

        // Now we queue the interface called nsIPrefBranch2. This interface is described as:  
        // "nsIPrefBranch2 allows clients to observe changes to pref values."
        // This is only necessary prior to Gecko 13
        if (!("addObserver" in this.branch))
            this.branch.QueryInterface(Components.interfaces.nsIPrefBranch2);

        // Finally add the observer.
        this.branch.addObserver("", this, false);
    },
    unregister: function () {
        this.branch.removeObserver("", this);
    },
    observe: function (subject, topic, data) {
        if (data === "largeFont") {
            this.setLargeFont();
        }
    },
    setLargeFont: function () {
        var largeFont = this.branch.getBoolPref("largeFont");
        Application.console.log("largeFont " + largeFont);
        var threadTree = document.getElementById("threadTree");
        var selectCol = document.getElementById("selectCol");
        if (largeFont) {
            threadTree.classList.add("largeFont");
            selectCol.width = "48";
        }
        else {
            threadTree.classList.remove("largeFont");
            selectCol.width = "32";
        }

        // force repaint
        var display = threadTree.style.display;
        threadTree.style.display = "none";
        threadTree.style.display = display; 
    }
}

window.addEventListener("load", doOnceLoaded, false);
window.addEventListener("unload", function () {
    prefObserver.unregister();
}, false);

function doOnceLoaded() {
    prefObserver.register();
    prefObserver.setLargeFont();
    var ObserverService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
    ObserverService.addObserver(CreateDbObserver, "MsgCreateDBView", false);
}

var CreateDbObserver = {
    // Components.interfaces.nsIObserver
    observe: function (aMsgFolder, aTopic, aData) {
        addCustomColumnHandler();
    }
}

function addCustomColumnHandler() {
    gDBView.addColumnHandler("selectCol", columnHandler);
}
