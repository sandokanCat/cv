<?php
declare(strict_types=1);

// ----------------------------
// AUTOLOAD v3.3
// ----------------------------

$serverDir   = __DIR__ . '/server';
$cacheDir    = __DIR__ . '/.cache';
$cacheFile   = "$cacheDir/autoload_v3.cache";
$debug       = false;
$loadedCores = [];

// ----------------------------
// CREATE CACHE DIRECTORY IF MISSING
// ----------------------------
if (!is_dir($cacheDir)) mkdir($cacheDir, 0755, true);

// ----------------------------
// LOAD OR REGENERATE CACHE
// ----------------------------
$cache = [
    'cores'      => [],
    'helpers'    => [],
    'timestamps' => []
];
$regenCache = true;

if (file_exists($cacheFile)) {
    $cache = unserialize(file_get_contents($cacheFile));
    $regenCache = false;

    foreach (array_merge($cache['cores'], $cache['helpers']) as $file) {
        if (!file_exists($file) || filemtime($file) !== ($cache['timestamps'][$file] ?? 0)) {
            $regenCache = true;
            break;
        }
    }
}

// ----------------------------
// REGENERATE CACHE IF NEEDED
// ----------------------------
if ($regenCache) {
    // --- CORES (NUMERICALLY ORDERED) ---
    $coreFiles = glob("$serverDir/[0-9]*_*.php");
    usort($coreFiles, fn($a,$b) => strnatcmp(basename($a), basename($b)));

    // --- HELPERS (ALL OTHER PHP FILES RECURSIVELY) ---
    $helperFiles = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($serverDir, RecursiveDirectoryIterator::SKIP_DOTS)
    );
    foreach ($iterator as $f) {
        if ($f->isFile() && strtolower($f->getExtension()) === 'php') {
            if (!in_array($f->getPathname(), $coreFiles)) {
                $relative = str_replace($serverDir.'/', '', $f->getPathname());
                $helperFiles[$relative] = $f->getPathname();
            }
        }
    }

    // --- UPDATE CACHE ---
    $cache['cores']      = $coreFiles;
    $cache['helpers']    = $helperFiles;
    $cache['timestamps'] = [];
    foreach (array_merge($coreFiles, $helperFiles) as $file) {
        $cache['timestamps'][$file] = filemtime($file);
    }

    file_put_contents($cacheFile, serialize($cache));
}

// ----------------------------
// LOAD CORES
// ----------------------------
foreach ($cache['cores'] as $file) {
    require_once $file;
    $loadedCores[] = basename($file);
}

// ----------------------------
// LAZY HELPER LOADER FUNCTION
// ----------------------------
function helper(string $name): void {
    static $loadedHelpers = [];
    global $cache, $serverDir;
    $file = $cache['helpers'][$name] ?? "$serverDir/$name.php";
    if (file_exists($file) && !isset($loadedHelpers[$file])) {
        require_once $file;
        $loadedHelpers[$file] = true;
    }
}

// ----------------------------
// PSR-4 AUTOLOADER FOR CLASSES
// ----------------------------
spl_autoload_register(function(string $class) use ($serverDir) {
    $file = $serverDir . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) require_once $file;
});

// ----------------------------
// CHECK REQUIRED CORES
// ----------------------------
$requiredCores = ['0_config.php','1_assets.php','2_i18n.php'];
$missing = array_diff($requiredCores, $loadedCores);
if (!empty($missing)) {
    throw new RuntimeException("MISSING ESSENTIAL CORE FILES: ".implode(', ', $missing));
}

// ----------------------------
// DEBUG LOG
// ----------------------------
if ($debug) {
    echo "<pre>[AUTOLOAD v3.3]\nCores:\n";
    foreach ($loadedCores as $c) echo "  $c\n";
    echo "Helpers:\n";
    foreach ($cache['helpers'] as $h => $f) echo "  $h\n";
    echo "</pre>";
}
?>