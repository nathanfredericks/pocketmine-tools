<?php
echo system("git fetch --recurse-submodules -j2") . "<br>"; // Submodules Added!
echo system("git merge origin/master") . "<br>";
