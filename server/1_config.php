<?php
declare(strict_types=1);

// ----------------------------
// CORE CONFIGURATION LOADER
// ----------------------------
function config(string $path, $default = null) {
    static $config = null;

    if ($config === null) {
        $iniFile = __DIR__ . '/../config.ini';
        if (!file_exists($iniFile)) {
            throw new RuntimeException("CONFIG.INI MISSING: $iniFile");
        }
        $config = parse_ini_file($iniFile, true, INI_SCANNER_TYPED);
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
// LOAD GLOBALS.JSON
// ----------------------------
function loadGlobals(): array {
    static $globals = null;

    if ($globals === null) {
        $globalsFile = __DIR__ . '/../js/globals.json';
        if (!file_exists($globalsFile)) {
            throw new RuntimeException("GLOBALS.JSON MISSING: {$globalsFile}");
        }
        $globals = json_decode(file_get_contents($globalsFile), true);
        if (!is_array($globals)) {
            throw new RuntimeException("GLOBALS.JSON INVALID: {$globalsFile}");
        }
    }

    return $globals;
}

// ----------------------------
// HELPER FUNCTION TO GET PATHS WITH CACHE
// ----------------------------
function G(array $array, string $path, string $context = 'text') {
    $keys = explode('.', $path);
    $v = $array;

    foreach ($keys as $k) {
        if (is_array($v) && array_key_exists($k, $v)) {
            $v = $v[$k];
        } else {
            return $context === 'json' ? [] : '';
        }
    }

    if ($context === 'json') return $v;

    if (is_array($v)) {
        foreach ($v as $item) {
            if (is_array($item)) return $v;
        }
        $v = implode(', ', $v);
    }

    return htmlspecialchars((string)$v, ENT_QUOTES | ENT_HTML5);
}


// ----------------------------
// GLOBAL VARIABLES
// ----------------------------
$brand        = config('brand', []);
$path         = config('path', []);
$tech         = config('tech', []);
$academy      = config('academy', []);
$verification = config('verification', []);
$globals      = loadGlobals();
?>