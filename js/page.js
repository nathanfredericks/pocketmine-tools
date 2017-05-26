/**
 * page.js by Ad5001
 * (C) Ad5001 2017
 */

window.onload = function() {
    console.log("Loaded !");
        document.querySelectorAll('input[type="file"]').forEach(function(elem) {
            elem.addEventListener("change",
                function(){
                    console.log(this.value.length > 0);
                    if (this.value.length > 0) {
                        document.querySelectorAll('input[type="submit"]').forEach(function(el) {
                            console.log(el + " to false");
                            el.setAttribute('disabled',false);
                            el.disabled = false;
                        });
                    } else {
                        document.querySelectorAll('input[type="submit"]').forEach(function(el) {
                            console.log(el + " to true");
                            el.setAttribute('disabled',true);
                            el.disabled = true;
                        });
                    }
                }
            )
        });
        // Preparing mobile UI.
        if(this.top.window.innerWidth < 800) { // Mobile, needs centering
            but = document.getElementById("UploadButton").style.margin = "0 auto";
        }
    };