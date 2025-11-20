<?php
// LOAD COMPILED GLOBALS
$globalsFile = __DIR__.'private/globals.php';
if (!file_exists($globalsFile)) {
    throw new RuntimeException("Globals file missing: $globalsFile");
}
$globals = include $globalsFile;

// GLOBALS ACCESS FUNCTION WITH CACHE
function G($globals, string $path, string $context='html') {
    static $cache = [];
    $cacheKey = "$path:$context";
    if (isset($cache[$cacheKey])) return $cache[$cacheKey];

    $keys = explode('.', $path);
    $v = $globals;
    foreach ($keys as $k) {
        if (!isset($v[$k])) return $cache[$cacheKey] = null;
        $v = $v[$k];
    }

    if (is_array($v)) return $cache[$cacheKey] = $v;

    switch ($context) {
        case 'html':
            $v = htmlspecialchars($v, ENT_QUOTES | ENT_HTML5);
            break;
        case 'url':
            $v = rawurlencode($v);
            break;
        case 'js':
        case 'json':
            break;
    }

    return $cache[$cacheKey] = $v;
}

// USER LANGUAGE DETECTION
function detectUserLang($globals): string {
    static $cachedLang = null;
    if ($cachedLang !== null) return $cachedLang;

    $supported = $globals['lang']['supportedLangs'] ?? 'en-GB';
    $fallback  = $globals['lang']['fallbackLang']['en'] ?? 'en-GB';
    $browserLangs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? $fallback);

    foreach ($browserLangs as $b) {
        $code = substr(strtolower(trim(explode(';', $b)[0])), 0, 2);
        if (isset($supported[$code])) return $cachedLang = $supported[$code][0];
    }

    return $cachedLang = $fallback;
}
$currentLang = detectUserLang($globals);

// LOAD COMPILED TRANSLATIONS
$translationsFile = __DIR__."private/{$currentLang}.php";
if (!file_exists($translationsFile)) {
    $translationsFile = __DIR__."private/en-GB.php";
    if (!file_exists($translationsFile)) {
        throw new RuntimeException("Fallback translations missing: {$translationsFile}");
    }
}
$translations = include $translationsFile;

// TRANSLATION FUNCTION WITH CACHE
function t(array $translations, string $key, string $type='text', string $default='') {
    static $cache = [];
    $cacheKey = "$key:$type";
    if (isset($cache[$cacheKey])) return $cache[$cacheKey];

    $value = $translations[$key][$type] ?? $default;
    return $cache[$cacheKey] = $value;
}

// DETERMINE TEXT DIRECTION
$rtlLangs = G($globals,'lang.rtlLangs', 'html') ?? [];
$dir = in_array(substr($currentLang,0,2), $rtlLangs) ? 'rtl' : 'ltr';

// TRANSLATION HELPERS
$T = fn($k,$t='text') => t($translations,$k,$t);
$L = fn($k,$t='aria-label') => t($translations,$k,$t);
$A = fn($k,$t='alt') => t($translations,$k,$t);
$H = fn($k,$t='html') => t($translations,$k,$t);

// EXPLODES
[$firstName,$lastName] = array_pad(explode(' ', G($globals,'brand.name')), 2, '');
$shortName = strtolower($firstName);
[$country,$region] = array_pad(explode('-', G($globals,'brand.region')), 2, '');
?>
