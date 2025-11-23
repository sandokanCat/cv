<?php
declare(strict_types=1);

// ----------------------------
// HELPER FUNCTION TO GET GLOBALS WITH CACHE
// ----------------------------
function G(array $lang, string $path, string $context='html') {
    static $cache = [];
    $cacheKey = "$path:$context";
    if(isset($cache[$cacheKey])) return $cache[$cacheKey];

    $keys = explode('.',$path);
    $v = $lang;
    foreach($keys as $k){
        if(!isset($v[$k])) return $cache[$cacheKey] = null;
        $v = $v[$k];
    }

    if(is_array($v)) return $cache[$cacheKey] = $v;

    switch($context){
        case 'html':
            $v = htmlspecialchars($v, ENT_QUOTES|ENT_HTML5);
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

// ----------------------------
// USER LANGUAGE DETECTION
// ----------------------------
function detectUserLang(array $lang): string {
    static $cachedLang = null;
    if($cachedLang !== null) return $cachedLang;

    $supported = $lang['lang']['supportedLangs'] ?? ['en-GB'];
    $fallback  = $lang['lang']['fallbackLang']['en'] ?? 'en-GB';
    $browserLangs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? $fallback);

    foreach($browserLangs as $b){
        $code = substr(strtolower(trim(explode(';',$b)[0])),0,2);
        if(isset($supported[$code])) return $cachedLang = $supported[$code][0];
    }

    return $cachedLang = $fallback;
}

// ----------------------------
// CURRENT LANGUAGE
// ----------------------------
$currentLang = detectUserLang($lang);

// ----------------------------
// LOAD TRANSLATIONS WITH CACHE
// ----------------------------
$translationsFile = __DIR__."/private/{$currentLang}.php";
if(!file_exists($translationsFile)){
    $translationsFile = __DIR__."/private/en-GB.php";
    if(!file_exists($translationsFile)){
        throw new RuntimeException("FALLBACK TRANSLATIONS MISSING: {$translationsFile}");
    }
}
$translations = include $translationsFile;

// ----------------------------
// TRANSLATION FUNCTION WITH CACHE
// ----------------------------
function t(array $translations, string $key, string $type='text', string $default=''){
    static $cache = [];
    $cacheKey = "$key:$type";
    if(isset($cache[$cacheKey])) return $cache[$cacheKey];

    $value = $translations[$key][$type] ?? $default;
    return $cache[$cacheKey] = $value;
}

// ----------------------------
// DIRECTION (RTL/LTR)
$rtlLangs = G($lang,'lang.rtlLangs', 'html') ?? [];
$dir = in_array(substr($currentLang,0,2), $rtlLangs) ? 'rtl' : 'ltr';

// ----------------------------
// TRANSLATION SHORTCUTS
$T = fn($k,$t='text') => t($translations,$k,$t);
$L = fn($k,$t='aria-label') => t($translations,$k,$t);
$A = fn($k,$t='alt') => t($translations,$k,$t);
$H = fn($k,$t='html') => t($translations,$k,$t);
?>