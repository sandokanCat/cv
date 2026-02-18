<?php declare(strict_types=1);

// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
}

// ----------------------------
// USER LANGUAGE OPTIONS
// ----------------------------
$langOpts = G($globals, 'lang', 'json') ?: [];

// ----------------------------
// URL LANGUAGE PARSING
// ----------------------------
$uriPath = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$uriSegments = explode('/', $uriPath);
$urlLang = $uriSegments[0] ?? null;
$validLangs = array_column($langOpts['op'] ?? [], 0);

// ----------------------------
// USER LANGUAGE DETECTION
// ----------------------------
function detectUserLang(array $langOpts = []): string
{
    static $cachedLang = null;
    if ($cachedLang !== null)
        return $cachedLang;

    $inCase = $langOpts['inCase'] ?? 'en-GB';
    $opLang = $langOpts['op'] ?? [];
    if (!is_array($opLang))
        $opLang = [];

    $normalized = [];
    foreach ($opLang as $short => $data) {
        if (is_array($data) && isset($data[0]))
            $normalized[strtolower($short)] = $data[0];
    }

    $browserLangs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? $inCase);
    foreach ($browserLangs as $b) {
        $b = strtolower(trim(explode(';', $b)[0]));
        $bShort = substr($b, 0, 2);

        if (isset($normalized[$bShort]))
            return $cachedLang = $normalized[$bShort];
    }

    return $cachedLang = $inCase;
}

// ----------------------------
// CURRENT LANGUAGE
// ----------------------------
$currentLang = in_array($urlLang, $validLangs) ? $urlLang : detectUserLang($langOpts);

// ----------------------------
// RTL / LTR
// ----------------------------
$rtlRaw = G($globals, 'lang.rtl', 'json') ?: [];
$rtl = array_map('strtolower', $rtlRaw);
$dir = in_array(strtolower(substr($currentLang, 0, 2)), $rtl) ? 'rtl' : 'ltr';

// ----------------------------
// LOAD TRANSLATIONS JSON
// ----------------------------
$translationsFile = __DIR__ . "/../../js/i18n/{$currentLang}.json";
if (!file_exists($translationsFile))
    $translationsFile = __DIR__ . "/../../js/i18n/en-GB.json";
$translations = json_decode(file_get_contents($translationsFile), true);

// ----------------------------
// DEEP MERGE FUNCTION
// ----------------------------
function array_merge_recursive_distinct(array $array1, array $array2): array
{
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
function t(array $translations, string $key, string $type = 'text', string $default = '', array $brand = [], string $lang = 'en-GB')
{
    $value = $translations[$key][$type] ?? $translations[$key] ?? ($brand['templates'][$key] ?? null) ?? ($brand[$lang][$key] ?? null) ?? ($brand[$key] ?? null) ?? $default;
    if (is_array($value))
        $value = $default;

    // INTERPOLATE BRAND
    $value = preg_replace_callback('/\{\{(brand\.)?([a-zA-Z0-9_]+)\}\}/', function ($m) use ($brand, $lang) {
        $isBrand = $m[1] ?? '';
        $k = $m[2];

        if ($isBrand) {
            if (isset($brand[$k])) {
                if (is_array($brand[$k]))
                    return reset($brand[$k]);

                return $brand[$k];
            }
            return $m[0];
        }

        if (isset($brand[$lang][$k]))
            return $brand[$lang][$k];

        if (isset($brand[$k]))
            return is_array($brand[$k]) ? reset($brand[$k]) : $brand[$k];

        return $m[0];
    }, $value);

    if ($type !== 'html')
        $value = htmlspecialchars((string) $value, ENT_QUOTES | ENT_HTML5);

    return $value;
}

// ----------------------------
// SHORTCUTS
// ----------------------------
$make = fn(string $defaultType) => fn(string $k, ?string $t = null) => t($translations, $k, $t ?? $defaultType, '', $brandData, $currentLang);

$T = $make('text');
$H = $make('html');
$A = $make('alt');
$L = $make('aria-label');

// ----------------------------
// NORMALIZE URI FOR REDIRECTION
// ----------------------------
$normalizedUri = rtrim($uriPath, '/') . '/';
$rootPaths = [''];

// ----------------------------
// ROUTING & ERROR MANAGEMENT
// ----------------------------
$sysError = (int) ($_SERVER['REDIRECT_STATUS'] ?? 0);
$isErrorPage = defined('IS_ERROR_PAGE') || $sysError >= 400;

if (!$isErrorPage) {
    // CASE A: SYSTEM ERROR
    if ($sysError >= 400) {
        http_response_code($sysError);
        $_GET['code'] = $sysError;
        require __DIR__ . '/../../partials/error.php';
        exit;
    }

    // CASE B: ROOT REDIRECTION
    if ($uriPath === '') {
        header("Location: " . $brand['url'] . $currentLang . '/', true, 302);
        exit;
    }

    // CASE C: INVALID ROUTE
    if (!in_array($urlLang, $validLangs) || count(array_filter($uriSegments)) > 1) {
        $err = preg_match('/(^|\/)[._]/', $uriPath) ? 403 : 404;
        http_response_code($err);
        $_GET['code'] = $err;
        require __DIR__ . '/../../partials/error.php';
        exit;
    }
}
?>