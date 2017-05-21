/**
 * tabs.js by Ad5001
 * (C) Ad5001 2017
 */

window.addEventListener("load", function() {
    // Headers show tab button
    var elems = document.getElementsByClassName('showTabList');
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener("click", slideTabMenu);
    };

    // Switching tab methods
    var tabListElems = document.getElementById('tabSelector').childNodes;
    for (var i = 0; i < tabListElems.length; i++) {
        tabListElems[i].addEventListener("click", function() {
            switchTab(this.getAttribute("href"));
        })
    }



    setTimeout(function() {
        // Removing "hidden" class element from tabselector
        document.getElementById('tabSelector').classList.remove("hidden");
    }, 1);
});


/* Switches tab. */
function switchTab(tabname) {
    console.log("Switching to tab " + tabname)
    document.querySelectorAll('header[type="pageheader"]')[0].childNodes[3].innerHTML = tabname.capitalize().replace(/_/gim, " ");
    document.querySelectorAll('tab[active="true"]')[0].setAttribute("active", "false");
    document.getElementById(tabname).setAttribute("active", "true");
    slideTabMenu();
}


/* Slides tabs menu */
function slideTabMenu() {
    // Adding sliding tab menu
    var elem = document.getElementById('tabSelector');
    elem.classList.toggle("hide");
    elem.classList.toggle("show");
    var width = window.innerWidth;
    // Stretch current tab to the left
    var tabs = document.getElementsByTagName('tab');
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute("active") == "true") {
            if (!tabs[i].classList.contains("slideRight") && !tabs[i].classList.contains("slideLeft")) tabs[i].classList.toggle("slideRight");
            tabs[i].classList.toggle("slideRight");
            tabs[i].classList.toggle("slideLeft");
        }
    }
    // Slide header to the left
    var tabs = document.getElementsByTagName('header');
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute("type") == "pageheader") {
            if (!tabs[i].classList.contains("slideRight") && !tabs[i].classList.contains("slideLeft")) tabs[i].classList.toggle("slideRight");
            tabs[i].classList.toggle("slideRight");
            tabs[i].classList.toggle("slideLeft");
        }
    }
    // Changing button style
    var elems = document.getElementsByClassName('showTabList');
    for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove("back");
    };
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}