<?php
declare(strict_types=1);

// ----------------------------
// CORE CONFIGURATION LOADER
// ----------------------------

// LOAD CONFIG.INI ONLY ONCE AND CACHE IN MEMORY
function config(string $path, $default = null) {
    static $config = null;

    if ($config === null) {
        $iniFile = __DIR__ . '/config.ini';
        if (!file_exists($iniFile)) {
            throw new RuntimeException("CONFIG.INI MISSING: $iniFile");
        }
        $config = parse_ini_file($iniFile, true);
    }

    $keys = explode('.', $path);
    $value = $config;

    foreach ($keys as $key) {
        if (is_array($value) && array_key_exists($key, $value)) {
            $value = $value[$key];
        } else {
            return $default;
        }
    }

    return $value;
}

// ----------------------------
// GLOBAL VARIABLES FOR BACKWARD COMPATIBILITY
// ----------------------------
$brand  = config('brand', []);
$lang   = config('lang', []);
$path   = config('path', []);
$knows  = config('knows', [])['know'] ?? [];
$academy= config('academy', []);
$agent  = config('agent', []);
?>