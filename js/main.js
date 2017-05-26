$(document).ready(
    function(){
        $('input:file').change(
            function(){
                if ($(this).val()) {
                    $('input:submit').attr('disabled',false);
                    // or, as has been pointed out elsewhere:
                    // $('input:submit').removeAttr('disabled'); 
                } 
            }
        );
        // Preparing mobile UI.
        $("iframe#content").load(
            function(){
                if(window.innerWidth < 800) { // Mobile, needs centering
                    but = document.getElementById("UploadButton").style.margin = "0 auto";
                }
            }
        )
    });