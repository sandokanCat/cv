<?php
declare(strict_types=1);

// ----------------------------
// NECESSARY VARIABLES
// ----------------------------

// BRAND AND CANONICAL URLs
$brandUrl = $brand['url'];
$canonicalUrl = $brandUrl . ($currentLang !== 'en-GB' ? "$currentLang/" : '');

// CURRENT LANGUAGE
$opLang      = G($globals,'lang.op','json') ?: [];

// COUNTRY AND REGION
[$country, $region] = array_pad(explode('-', ($brand['region'] ?? ''), 2), 2, '');

// LOCALES FOR OG
$ogLocales = [];
if(is_array($opLang)) {
    foreach($opLang as $key => $locale) {
        $code = is_array($locale) ? ($locale[0] ?? 'en-GB') : $locale;
        $ogLocales[$key] = str_replace('-', '_', $code);
    }
}

// DNS-PREFETCH URLS
$dnsPrefetch = array_map(
    fn($url) => preg_replace('#^https?://#','',$url), $path['social'] ?: []
);

// SEARCH ENGINE VERIFICATION META TAGS
$metaKeys    = [
    // INTERNATIONAL
    "google" => "google-site-verification",
    "bing"   => "msvalidate.01",

    // RUSSIA
    "yandex" => "yandex-verification",
    // "mailru" => "mailru-domain",
];

// EXPLODE NAMES
[$firstName, $lastName] = array_pad(explode(' ', ($brand['name'] ?? ''), 2), 2, '');
$shortName = strtolower($firstName);

// SAMEAS ARRAY
$pathSocial  = $path['social'] ?? [];
if (!is_array($pathSocial)) $pathSocial = [];
$sameAs = array_values(array_map(fn($k) => $pathSocial[$k] ?? '', ['github', 'vercel', 'linkedin', 'discord', 'infojobs']));

// TECHNICAL SKILLS
$knowsAbout  = array_merge(
    is_array($tech['languages'] ?? null) ? $tech['languages'] : [],
    is_array($tech['tools'] ?? null)     ? $tech['tools']     : [],
    is_array($tech['systems'] ?? null)   ? $tech['systems']   : [],
);
if (!is_array($knowsAbout)) $knowsAbout = [];

// ACADEMIES
$academies = $academy;
if(!is_array($academies)) $academies = [];
$alumniOf = [];
foreach ($academies as $aca) {
    if (!is_array($aca)) continue;
    $alumniOf[] = [
        "@type" => "EducationalOrganization",
        "name" => $aca['name'] ?? '',
        "url"  => $aca['url'] ?? '',
        "logo" => $aca['logo'] ?? ''
    ];
}
?>
