<?php
declare(strict_types=1);

// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
}

// FOR DEVELOPMENT
$isDev = !empty($_SERVER['HTTP_HOST']) && (
    str_starts_with($_SERVER['HTTP_HOST'], 'localhost') ||
    str_starts_with($_SERVER['HTTP_HOST'], '127.0.0.1')
);
if ($isDev) {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    error_reporting(E_ALL);
}

// ----------------------------
// NECESSARY VARIABLES
// ----------------------------

// CURRENT LANGUAGE
$opLang = G($globals, 'lang.op', 'json') ?: [];

// COUNTRY AND REGION
[$country, $region] = array_pad(explode('-', ($brand['region'] ?? ''), 2), 2, '');

// LOCALES FOR OG
$ogLocales = [];
if (is_array($opLang)) {
    foreach ($opLang as $key => $locale) {
        $code = is_array($locale) ? ($locale[0] ?? 'en-GB') : $locale;
        $ogLocales[$key] = str_replace('-', '_', $code);
    }
}

// DNS-PREFETCH URLS
$dnsPrefetch = array_map(
    fn($url) => $url,
    $path['social'] ?: []
);

// EXPLODE NICK
[$firstNick, $lastNick] = array_pad(explode('.', ($brand['nick'] ?? ''), 2), 2, '');
$capitalizedNick = $firstNick !== ''
    ? mb_convert_case($firstNick, MB_CASE_TITLE, 'UTF-8')
    : '';

// EXPLODE NAMES
[$firstName, $lastName] = array_pad(explode(' ', ($brand['name'] ?? ''), 2), 2, '');
$shortName = strtolower($firstName);

// SAMEAS ARRAY
$pathSocial = $path['social'] ?? [];
if (!is_array($pathSocial))
    $pathSocial = [];
$sameAs = array_values(array_map(fn($k) => $pathSocial[$k] ?? '', ['github', 'vercel', 'linkedin', 'discord', 'infojobs']));

// TECHNICAL SKILLS
$languages = is_array($tech['languages'] ?? null)
    ? ["@type" => "Thing", "name" => $tech['languages']]
    : ["@type" => "Thing", "name" => []];
$tools = is_array($tech['tools'] ?? null)
    ? ["@type" => "Thing", "name" => $tech['tools']]
    : ["@type" => "Thing", "name" => []];
$systems = is_array($tech['systems'] ?? null)
    ? ["@type" => "Thing", "name" => $tech['systems']]
    : ["@type" => "Thing", "name" => []];
$knowsAbout = [
    "languages" => $languages,
    "tools" => $tools,
    "systems" => $systems
];

// ACADEMIES
$academies = $academy;
if (!is_array($academies))
    $academies = [];
$alumniOf = [];
foreach ($academies as $aca) {
    if (!is_array($aca))
        continue;
    $alumniOf[] = [
        "@type" => "EducationalOrganization",
        "name" => $aca['name'] ?? '',
        "url" => $aca['url'] ?? '',
        "logo" => $aca['logo'] ?? ''
    ];
}

// VERIFICATION META KEYS
$metaKeys = [];
foreach ($verification as $agent => $keys) {
    if (is_array($keys)) {
        foreach ($keys as $metaName => $value) {
            $metaKeys[$metaName] = $value;
        }
    }
}

// TECH STACK
$blockchain = G($globals, 'tech.blockchain', 'json') ?: [];
$fortyTwo = G($globals, 'tech.42bcn', 'json') ?: [];
$backTech = G($globals, 'tech.backEnd', 'json') ?: [];
$frontTech = G($globals, 'tech.frontEnd', 'json') ?: [];
?>