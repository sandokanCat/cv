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
// DEEP MERGE FUNCTION
// ----------------------------
function array_merge_recursive_distinct(array $array1, array $array2): array {
    $merged = $array1;
    foreach ($array2 as $key => $value) {
        if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
            $merged[$key] = array_merge_recursive_distinct($merged[$key], $value);
        } else {
            $merged[$key] = $value;
        }
    }
    return $merged;
}

// ----------------------------
// MERGE BRAND DATA (INI + JSON)
// ----------------------------
$brandData = array_merge_recursive_distinct($brand ?? [], $globals['brand'] ?? []);

// ----------------------------
// TRANSLATION FUNCTION
// ----------------------------
function t(array $translations, string $key, string $type='text', string $default='', array $brand = [], string $lang = 'en-GB') {
    $value =
        $translations[$key][$type] ??
        $translations[$key] ??
        ($brand['templates'][$key] ?? null) ??
        ($brand[$lang][$key] ?? null) ??
        ($brand[$key] ?? null) ??
        $default;

    if (is_array($value)) $value = $default;

    // INTERPOLATE BRAND
    $value = preg_replace_callback('/\{\{(brand\.)?([a-zA-Z0-9_]+)\}\}/', function($m) use($brand, $lang) {
        $isBrand = $m[1] ?? '';
        $k = $m[2];
    
        if ($isBrand) {
            if (isset($brand[$k])) {
                if (is_array($brand[$k])) return reset($brand[$k]);
                return $brand[$k];
            }
            return $m[0];
        }
    
        if (isset($brand[$lang][$k])) return $brand[$lang][$k];
    
        if (isset($brand[$k])) return is_array($brand[$k]) ? reset($brand[$k]) : $brand[$k];
    
        return $m[0];
    }, $value);    

    // ESCAPE IF NEEDED
    if ($type !== 'html') $value = htmlspecialchars((string)$value, ENT_QUOTES|ENT_HTML5);

    return $value;
}

// ----------------------------
// RTL / LTR
$rtlRaw = G($globals,'lang.rtl','json') ?: [];
$rtl = array_map('strtolower', $rtlRaw);
$dir = in_array(strtolower(substr($currentLang,0,2)), $rtl) ? 'rtl' : 'ltr';

// ----------------------------
// SHORTCUTS
// ----------------------------
$make = fn(string $defaultType)
    => fn(string $k, ?string $t = null)
        => t($translations, $k, $t ?? $defaultType, '', $brandData, $currentLang);

$T = $make('text');
$H = $make('html');
$A = $make('alt');
$L = $make('aria-label');
?>
