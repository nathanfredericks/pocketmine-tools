<?php

ini_set("display_errors", -1);

global $ROOT_DIR;
global $plData;
global $fName;
$ROOT_DIR = implode(DIRECTORY_SEPARATOR, array_slice(explode(DIRECTORY_SEPARATOR, __DIR__), 0, count(explode(DIRECTORY_SEPARATOR, __DIR__)) - 2));

try {
   
    // Undefined | Multiple Files | $_FILES Corruption Attack
    if (
        !isset($_FILES['upfile']['error']) ||
        is_array($_FILES['upfile']['error']) ||
        !isset($_POST["API_version"])
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
    if ($_FILES['upfile']['size'] > 50000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }

    // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
    // Check MIME Type by yourself.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($_FILES['upfile']['tmp_name']),
        array(
            'phar' => "application/octet-stream",
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }


    $fName = "phar_" . sha1_file($_FILES['upfile']['tmp_name']);

    // Moving PHAR file.
    if (!move_uploaded_file(
        $_FILES['upfile']['tmp_name'],
        "$ROOT_DIR/data/tmp/$fName.phar"
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }

    // New name
    $plData = @yaml_parse(file_get_contents("phar://$ROOT_DIR/data/tmp/$fName.phar/plugin.yml"));
    if($plData == false) throw new RuntimeException("Invalid plugin.yml");
    $oldFName = $fName;
    $fName = "phar_" . $plData["name"] ."_v" . $plData["version"] . sha1_file("$ROOT_DIR/data/tmp/$oldFName.phar");
    exec("mv $ROOT_DIR/data/tmp/$oldFName.phar $ROOT_DIR/data/phars/$fName.phar");

    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator("phar://$ROOT_DIR/data/phars/$fName.phar"),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    // Changing files
    foreach ($files as $name => $file) {
        if (!$file->isDir()) {
            $path = $file->getRealPath();
            if(pathinfo($path, PATHINFO_EXTENSION) == "php") {
                if(isset($_POST["TagReplace"])) {
                    $contents = file_get_contents($path);
                    foreach([
        		    	"ByteArray" => "ByteArrayTag",
        		    	"Byte" => "ByteTag",
        		    	"Compound" => "CompoundTag",
        		    	"Double" => "DoubleTag",
        		    	"End" => "EndTag",
        		    	"Float" => "FloatTag",
        		    	"IntArray" => "IntArrayTag",
        		    	"Int" => "IntTag",
        		    	"Enum" => "ListTag",
        		    	"Long" => "LongTag",
        		    	"Short" => "ShortTag",
        		    	"String" => "StringTag",
        		    ] as $oldTag => $newTag) {
                        $contents = preg_replace("/pocketmine\\nbt\\tag\\$oldTag(;|\()/mi", "pocketmine\\nbt\\tag\\$newTag$1/", $contents);
                    }
                }
                if(isset($_POST["ProtocolReplace"])) {
                    $contents = file_get_contents($path);
                    $contents = preg_replace("/pocketmine\\network\\protocol\\(.+?)(;|\()/mi", "pocketmine\\network\\mcpe\\protocol\\$1$2/", $contents);
                }
            }
        }
    }

    // Chaging API (finally)
    if(preg_match("/\d+\.\d+\.\d+/", $_POST["API_version"]) == false) {
        throw new RuntimeException("Invalid new API provided");
    } else {
        if(is_string($plData["api"])) $plData["api"] = [$plData["api"]];
        if(!in_array($_POST["API_version"], $plData["api"])) {
            $plData["api"][] = $_POST["API_version"];
        } else {
            throw new RuntimeException("API provided already supported by plugin.");
        }
    }

    file_put_contents("phar://$ROOT_DIR/data/phars/$fName.phar/plugin.yml", @yaml_emit($plData));
} catch(Exception $e) {
    $error = $e->getMessage();
    if(isset($fName)) unlink("$ROOT_DIR/data/phars/$fName.phar");
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
    <h2><?php echo !isset($error) ? "<h3>Update Complete!</h3><br><p>Your file was successfully converted. You should now be able to use your plugin in \"PocketMine-MP\"<br><strong>Corrupted Plugin? Send the file over using twitter and we will track down the issue!</strong></p>" : "<h2>Could not build phar: $error</h2>"; ?>
        <?php if(!isset($error)) echo '<a href="download.php?n=' . $fName . '"><button class="mdl-button mdl-js-button mdl-js-ripple-effect">Download</button></a>'; ?>
        <a href="index.html"><button class="mdl-button mdl-js-button mdl-js-ripple-effect">Go back</button></a>
    </p>
   <div id="google_translate_element"></div><script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT, autoDisplay: false}, 'google_translate_element');
}
</script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        
</body>
</html>
