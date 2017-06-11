window.addEventListener("load", function() {
    var report = browserReportSync();
    console.log(report);
    switch(report.os.name) {
        case "Linux":
        // .deb download link
        var downloadLink = document.createElement("a");
        downloadLink.href = "/download/pocketmine-tools_1.0-1.deb";
        var downloadB = document.createElement("button");
        downloadB.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect", "mdl-color--cyan", "mdl-color-text--white", "mld-button--download");
        var downloadI = document.createElement("i");
        downloadI.classList.add("mdl-color-text--white","material-icons");
        downloadI.setAttribute("role", "presentation");
        downloadI.innerHTML = "file_download";
        downloadText = document.createElement("p");
        downloadText.innerHTML = "Debian (and based off os) (.deb)";
        downloadB.appendChild(downloadI);
        downloadB.appendChild(downloadText);
        downloadLink.appendChild(downloadB);
        document.getElementById("downloads").appendChild(downloadLink);
        // .tar.gz download link
        var downloadLink = document.createElement("a");
        downloadLink.href = "/download/pocketmine-tools_1.0-1.deb";
        var downloadB = document.createElement("button");
        downloadB.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect", "mdl-color--cyan", "mdl-color-text--white", "mld-button--download");
        var downloadI = document.createElement("i");
        downloadI.classList.add("mdl-color-text--white","material-icons");
        downloadI.setAttribute("role", "presentation");
        downloadI.innerHTML = "file_download";
        downloadText = document.createElement("p");
        downloadText.innerHTML = "Other linux (.tar.gz)";
        downloadB.appendChild(downloadI);
        downloadB.appendChild(downloadText);
        downloadLink.appendChild(downloadB);
        document.getElementById("downloads").appendChild(downloadLink);
        break;
        case "Windows":
        var downloadLink = document.createElement("a");
        downloadLink.href = "/download/PMTSetup.exe";
        var downloadB = document.createElement("button");
        downloadB.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect", "mdl-color--cyan", "mdl-color-text--white", "mld-button--download");
        var downloadI = document.createElement("i");
        downloadI.classList.add("mdl-color-text--white","material-icons");
        downloadI.setAttribute("role", "presentation");
        downloadI.innerHTML = "file_download";
        downloadText = document.createElement("p");
        downloadText.innerHTML = "Windows (.exe)";
        downloadB.appendChild(downloadI);
        downloadB.appendChild(downloadText);
        downloadLink.appendChild(downloadB);
        document.getElementById("downloads").appendChild(downloadLink);
        break;
        default:
        downloadText = document.createElement("p");
        downloadText.innerHTML = "Your os (" + report.os.name + ") does not have any application made yet. Please check back later.";
        break;
    }
});