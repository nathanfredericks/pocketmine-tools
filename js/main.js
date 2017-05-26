window.onload = function() {
    console.log("Loaded !");
        // Setting tab based elements
        document.querySelectorAll("a.mdl-navigation__link").forEach(function(elem){
            elem.addEventListener("click",
                function(){
                    document.querySelectorAll("a.mdl-navigation__link").forEach(function(el) {
                        el.setAttribute("data-active-tab", "false");
                    });
                    elem.setAttribute("data-active-tab", "true");
                }
            );
        });
    };