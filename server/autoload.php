<?php declare(strict_types=1);

// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
}

// LOAD CSP HEADERS
define('ALLOW_CSPHEADER', true);
require_once __DIR__ . '/../_secure/CSPheader.php';

// REPORT ERRORS
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ----------------------------
// AUTOLOAD v4.0 (NO CACHE)
// ----------------------------

$serverDir = __DIR__.'/modules/';
$loadedCores = [];

// ----------------------------
// LOAD CORE FILES (ORDERED)
// ----------------------------
// COMMENT: LOAD NUMERICALLY ORDERED CORE FILES
$coreFiles = glob("$serverDir/[0-9]*_*.php");
usort($coreFiles, fn($a, $b) => strnatcmp(basename($a), basename($b)));

foreach ($coreFiles as $file) {
    require_once $file;
    $loadedCores[] = basename($file);
}

// ----------------------------
// LAZY HELPER LOADER FUNCTION
// ----------------------------
// COMMENT: LOAD HELPERS ONLY WHEN REQUESTED
function helper(string $name): void
{
    static $loadedHelpers = [];
    global $serverDir;

    // BUILD EXPECTED PATH
    $file = "$serverDir/$name.php";

    // RECURSIVE SEARCH IF NOT FOUND
    if (!file_exists($file)) {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($serverDir, RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $f) {
            if (
                $f->isFile() &&
                strtolower($f->getExtension()) === 'php' &&
                basename($f->getPathname()) === "$name.php"
            ) {
                $file = $f->getPathname();
                break;
            }
        }
    }

    // LOAD IF EXISTS AND NOT PREVIOUSLY LOADED
    if (file_exists($file) && !isset($loadedHelpers[$file])) {
        require_once $file;
        $loadedHelpers[$file] = true;
    }
}

// ----------------------------
// PSR-4 AUTOLOADER FOR CLASSES
// ----------------------------
spl_autoload_register(function (string $class) use ($serverDir) {
    // COMMENT: MAP NAMESPACE TO FILE PATH
    $file = $serverDir . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// ----------------------------
// CHECK REQUIRED CORES
// ----------------------------
$requiredCores = [
    '0_config.php',
    '1_i18n.php',
    '2_assets.php'
];
$missing = array_diff($requiredCores, $loadedCores);
if (!empty($missing)) {
    throw new RuntimeException("MISSING ESSENTIAL CORE FILES: " . implode(', ', $missing));
}
?>