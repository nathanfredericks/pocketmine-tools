<?php

ini_set("display_errors", -1);

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
    $phar = new Phar("$ROOT_DIR/data/tmp/$fName.phar");
    $phar->extractTo("$ROOT_DIR/data/tmp/$fName");
    $plData = @yaml_parse_file("$ROOT_DIR/data/tmp/$fName/plugin.yml");
    if($plData == false) $plData = ["name" => "Unknown", "author" => "Unknown", "api" => "3.0.0", "version" => 1.0];
    unlink("$ROOT_DIR/data/tmp/$fName.phar");

    // Building zip
    global $zipFileName;
    $zipFileName = "zip_" . $plData["name"] . "_" . sha1(sha1_file($ROOT_DIR . "/data/tmp/$fName") . sha1(time()));
    $zip = new ZipArchive();
    if(file_exists($ROOT_DIR . "/data/phars/$zipFileName.zip")) unlink($ROOT_DIR . "/data/phars/$zipFileName.zip"); // Should only rarely happend
    $zip->open($ROOT_DIR . "/data/phars/$zipFileName.zip", ZIPARCHIVE::CREATE);
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator("$ROOT_DIR/data/tmp/$fName"),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    // Adding files
    foreach ($files as $name => $file) {
        if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen("$ROOT_DIR/data/tmp/$fName") + 1);
            $zip->addFile($filePath, $relativePath);
        }
    }
    $zip->close();
    chmod($ROOT_DIR . "/data/phars/$zipFileName.zip", 0777);
} catch(Exception $e) {
    $error = $e->getMessage();
}
if(isset($fName)) exec("rm -rf $ROOT_DIR/data/tmp/$fName");
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
    <h2><?php echo !isset($error) ? "<h3>Successfully Created!</h3><br><p>Your file was successfully converted. You should now be able to use your plugin in \"PocketMine-MP\"<br><strong>Corrupted Plugin? Send the file over twitter and we will track down the issue!</strong></p>" : "<h3>Could not build zip: $error</h3>"; ?></h2>
        <?php if(!isset($error)) echo '<a href="download.php?n=' . $zipFileName . '"><button class="mdl-button mdl-js-button mdl-js-ripple-effect">Download</button></a>'; ?>
        <a href="index.html"><button class="mdl-button mdl-js-button mdl-js-ripple-effect">Go back</button></a>
    </p>
   <div id="google_translate_element"></div><script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT, autoDisplay: false}, 'google_translate_element');
}
</script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        
</body>
</html>
