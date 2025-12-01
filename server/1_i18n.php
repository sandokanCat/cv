<?php
declare(strict_types=1);

// ----------------------------
// USER LANGUAGE DETECTION
// ----------------------------
$langOpts = G($globals,'lang','json') ?: [];
function detectUserLang(array $langOpts = []): string {
    static $cachedLang = null;
    if ($cachedLang !== null) return $cachedLang;

    $inCase = $langOpts['inCase'] ?? 'en-GB';
    $opLang = $langOpts['op'] ?? [];
    if (!is_array($opLang)) $opLang = [];

    $normalized = [];
    foreach ($opLang as $short => $data) {
        if (is_array($data) && isset($data[0])) $normalized[strtolower($short)] = $data[0];
    }

    $browserLangs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? $inCase);
    foreach ($browserLangs as $b) {
        $b = strtolower(trim(explode(';',$b)[0]));
        $bShort = substr($b,0,2);
        if(isset($normalized[$bShort])) return $cachedLang = $normalized[$bShort];
    }

    return $cachedLang = $inCase;
}

// ----------------------------
// CURRENT LANGUAGE
// ----------------------------
$currentLang = detectUserLang($langOpts);

// ----------------------------
// LOAD TRANSLATIONS JSON
// ----------------------------
$translationsFile = __DIR__."/../js/i18n/{$currentLang}.json";
if(!file_exists($translationsFile)) $translationsFile = __DIR__."/../js/i18n/en-GB.json";
$translations = json_decode(file_get_contents($translationsFile), true);

// ----------------------------
// TRANSLATION FUNCTION WITH ESCAPING
// ----------------------------
function t(array $translations, string $key, string $type='text', string $default=''){
    $value = $translations[$key][$type] ?? $translations[$key] ?? $default;
    if (is_array($value)) $value = $default;
    if($type !== 'html') $value = htmlspecialchars((string)$value, ENT_QUOTES|ENT_HTML5);
    return $value;
}

// ----------------------------
// RTL / LTR
$rtlRaw = G($globals,'lang.rtl','json');
if (!is_array($rtlRaw)) $rtlRaw = [];
$rtl = array_map('strtolower', $rtlRaw);
$dir = in_array(strtolower(substr($currentLang,0,2)), $rtl) ? 'rtl' : 'ltr';

// ----------------------------
// SHORTCUTS
$T = fn($k,$t='text') => t($translations,$k,$t);
$L = fn($k,$t='aria-label') => t($translations,$k,$t);
$A = fn($k,$t='alt') => t($translations,$k,$t);
$H = fn($k,$t='html') => t($translations,$k,'html');
?>
