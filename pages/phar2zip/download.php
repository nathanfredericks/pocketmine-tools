<?php

global $ROOT_DIR;
$ROOT_DIR = "/tmp";

if(!isset($_GET["n"]) || !file_exists($ROOT_DIR . "/data/phars/" . $_GET["n"] . ".zip")) {
    header("Location: index.html");
    exit();
}

$plData = yaml_parse(file_get_contents("zip://" . $ROOT_DIR . "/data/phars/" . $_GET["n"] . ".zip/plugin.yml"));
if($plData == false) $plData = ["name" => "Unknown", "author" => "Unknown", "api" => "3.0.0", "version" => 1.0];
$name = $plData["name"] . "_v" . $plData["version"];
header("Content-Type: application/zip");
header("Content-Disposition: filename=\"$name.zip\"");
echo file_get_contents($ROOT_DIR . "/data/phars/" . $_GET["n"] . ".zip");