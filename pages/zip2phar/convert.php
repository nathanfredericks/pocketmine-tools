<?php

ini_set("display_errors", -1);

const WARNING = "WARNING";
const ERROR = "ERROR";
const CRITICAL = "CRITICAL";
global $ROOT_DIR;
$ROOT_DIR = implode(DIRECTORY_SEPARATOR, array_slice(explode(DIRECTORY_SEPARATOR, __DIR__), 0, count(explode(DIRECTORY_SEPARATOR, __DIR__)) - 2));

try {
   
    // Undefined | Multiple Files | $_FILES Corruption Attack
    if (
        !isset($_FILES['upfile']['error']) ||
        is_array($_FILES['upfile']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    // Check $_FILES['upfile']['error'] value.
    switch ($_FILES['upfile']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // You should also check filesize here.
    if ($_FILES['upfile']['size'] > 100000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }

    // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
    // Check MIME Type by yourself.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($_FILES['upfile']['tmp_name']),
        array(
            'zip' => "application/zip",
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }

    $fName = "zip_" . sha1_file($_FILES['upfile']['tmp_name']);

    // Moving ZIP file.
    if (!move_uploaded_file(
        $_FILES['upfile']['tmp_name'],
        "$ROOT_DIR/data/tmp/$fName.zip"
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }
    $zip = new ZipArchive();
    $zip->open("$ROOT_DIR/data/tmp/$fName.zip");
    $zip->extractTo("$ROOT_DIR/data/tmp/$fName");
    $zip->close();
    unlink("$ROOT_DIR/data/tmp/$fName.zip");

    // Done uploading file, now checking...
    // First, checking required files.
    if(!file_exists($ROOT_DIR . "/data/tmp/$fName/plugin.yml")) {
        $folder = array_diff(scandir($ROOT_DIR . "/data/tmp/$fName/"), ["..", "."])[2];
        if(file_exists($ROOT_DIR . "/data/tmp/$fName/$folder/plugin.yml")) {
            $fName .= DIRECTORY_SEPARATOR . $folder;
        } else {
            throw new RuntimeException("Could not find plugin.yml.");
        }
    }
    if(($plData = yaml_parse_file($ROOT_DIR . "/data/tmp/$fName/plugin.yml")) == false || !isset($plData["main"], $plData["name"], $plData["version"], $plData["author"], $plData["api"])) {
        throw new RuntimeException("Invalid plugin.yml provided.");
    }
    if(!file_exists($ROOT_DIR . "/data/tmp/$fName/src/" . str_ireplace("\\", DIRECTORY_SEPARATOR, $plData["main"] . ".php"))) {
        throw new RuntimeException("Could not find Main file (src/{$plData["main"]}.php)");
    }

    // Basic data provided. Now checking errors
    global $errors;
    $errors = [];

    $newApi = false;
    foreach(is_string($plData["api"]) ? [$plData["api"]] : $plData["api"] as $api) {
        if(strpos($api, "3.0.0") !== false) {
            $newApi = true;
        }
    }
    if(!$newApi) {
        $errors["This plugin is not compatible with new versions of PocketMine. Please consider updating your plugin and bumping the API in your plugin.yml"] = WARNING;
    }

    checkDir($ROOT_DIR . "/data/tmp/$fName");

    // Building phar
    global $pharFileName;
    $pharFileName = "phar_" . $plData["name"] . "_" . sha1(sha1_file($ROOT_DIR . "/data/tmp/$fName") . sha1(time()));
    $phar = new Phar($ROOT_DIR . "/data/phars/$pharFileName.phar");
    $phar->setStub("<?php echo 'Phar compiled on https://pmt.mcpe.fun.'; __HALT_COMPILER();");
    $phar->setMetadata($plData);
    $phar->buildFromDirectory($ROOT_DIR . "/data/tmp/$fName");
} catch(Exception $e) {
    $errors[$e->getMessage()] = CRITICAL;
}

if(isset($fName)) exec("rm -rf $ROOT_DIR/data/tmp/$fName");

function checkDir($dir) {
    foreach(array_diff(scandir($dir), [".", ".."]) as $f) {
        if(is_file($dir . DIRECTORY_SEPARATOR . $f)) {
            switch(pathinfo($dir . DIRECTORY_SEPARATOR . $f, PATHINFO_EXTENSION)) {
                case "php":
                $res = proc_open("php -l " . $dir . DIRECTORY_SEPARATOR . $f, [1 => ["pipe", "w"], 2 => ["pipe", "w"]], $pipes);
                if(is_resource($res)) {
                    $stdout = stream_get_contents($pipes[1]);
                    $stderr = stream_get_contents($pipes[2]);
                    fclose($pipes[1]);
                    fclose($pipes[2]);
                    proc_close($res);
                    if(strpos($stdout, "Errors parsing ") !== false) {
                        foreach(explode("\n", str_ireplace(__DIR__, "", $stderr)) as $error) {
                            $errors[$error] = ERROR;
                        }
                    }
                }
                break;
                case "yml":
                case "yaml":
                if(yaml_parse_file($dir . DIRECTORY_SEPARATOR . $f) == false) $errors["An error was detected while decoding the yaml file located at ". str_ireplace(__DIR__, "", $dir . DIRECTORY_SEPARATOR . $f) . "."] = WARNING;
                break;
                case "json":
                json_decode(file_get_contents($dir . DIRECTORY_SEPARATOR . $f));
                $err = json_last_error();
                if($err !== 0) {
                    $errors["An error was detected while decoding the json file located at ". str_ireplace(__DIR__, "", $dir . DIRECTORY_SEPARATOR . $f) . ": " . json_last_error_msg()] = WARNING;
                }
                break;
            }
        } elseif(is_dir($dir . DIRECTORY_SEPARATOR . $f)) {
            checkDir($dir . DIRECTORY_SEPARATOR . $f);
        }
    }
}

?>

<html>

<head>
    <link href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://code.getmdl.io/1.3.0/material.cyan-light_blue.min.css" rel="stylesheet">
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js">
    </script>
    <link href="https://archive.org/download/material-design-style-css/styles.css" rel="stylesheet">
    <link href="/css/main.css" rel="stylesheet">
    <title>PMT - PocketMine Tools</title>
</head>

<body>
    <h2><?php echo in_array(CRITICAL, $errors) ? "<h3>Could not build phar:</h3>" : "<h3>Successfully Created!</h3><br><p>Your file was successfully converted. You should now be able to use your plugin in \"PocketMine-MP\"<br><strong>Corrupted Plugin? Send the file over twitter and we will track down the issue!</strong></p>"; ?></h2>
    <p>Errors found (<?php echo count($errors) ?>):<br>
        <?php
        foreach($errors as $errmsg => $type) {
            echo "<b>$type:</b> $errmsg<br/>";
        }
        ?>
        <?php if(!in_array(CRITICAL, $errors)) echo '<a href="download.php?n=' . $pharFileName . '"><button class="mdl-button mdl-js-button mdl-js-ripple-effect">Download</button></a>'; ?>
        <a href="index.html"><button class="mdl-button mdl-js-button mdl-js-ripple-effect">Go back</button></a>
    </p>
</body>
</html>