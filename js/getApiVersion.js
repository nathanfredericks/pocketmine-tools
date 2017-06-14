
window.addEventListener("load", function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var api = /const API_VERSION = "(.+)";/.exec(xhttp.responseText);
            if (document.getElementsByName("API_version")[0] !== undefined) {
                document.getElementsByName("API_version")[0].value = api[1];
            }
        }
    };
    xhttp.open("GET", "https://raw.githubusercontent.com/pmmp/PocketMine-MP/master/src/pocketmine/PocketMine.php", true);
    xhttp.send();
})