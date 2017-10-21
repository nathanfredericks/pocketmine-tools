/**
 * page.js by Ad5001
 * (C) Ad5001 2017
 */
const MOBILE_OS = [
    "iOS",
    "Android",
    "Windows Phone",
    "BlackBerry",
    "BlackBerryOS",
    "BlackBerryTabletOS",
]


window.onload = function() {
    console.log("Loaded !");
    var report = browserReportSync();
    // Check if a mobile web browser which doesn't include change events on inputs (causing bugs). 
    // TODO: Remove this when mobile oses will support it.
    var isMobile = false;
    if (MOBILE_OS.indexOf(report.os.name)) {
        document.querySelectorAll('input[type="submit"]').forEach(function(el) {
            console.log(el + " to false");
            el.setAttribute('disabled', false);
            el.disabled = false;
        });
    } else {
        addComputerDiableChange();
    }
    setTimeout(100, function() {
        document.body.style.minHeight = "unset";
    });
    // Preparing mobile UI.
    if (this.top.window.innerWidth < 800) { // Mobile, needs centering
        but = document.getElementById("UploadButton").style.margin = "0 auto";
    }
};


function addComputerDiableChange() {
    console.log("Adding listener to button")
    document.querySelectorAll('input[type="file"]').forEach(function(elem) {
        elem.addEventListener("change",
            function() {
                console.log(this.value.length > 0);
                if (this.value.length > 0) {
                    document.querySelectorAll('input[type="submit"]').forEach(function(el) {
                        console.log(el + " to false");
                        el.setAttribute('disabled', false);
                        el.disabled = false;
                    });
                } else {
                    document.querySelectorAll('input[type="submit"]').forEach(function(el) {
                        console.log(el + " to true");
                        el.setAttribute('disabled', true);
                        el.disabled = true;
                    });
                }
            }
        )
    });
}