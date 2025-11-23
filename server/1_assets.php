<?php
declare(strict_types=1);

// ----------------------------
// ASSETS AND SEO META LOADER
// ----------------------------

// LOAD BRAND URL FOR CANONICAL
$brandUrl = config('brand.url', []);

// DETERMINE CANONICAL URL BASED ON LANGUAGE
$currentLang = $currentLang ?? 'en-GB';
$canonicalUrl = $brandUrl . ($currentLang !== 'en-GB' ? "$currentLang/" : '');

// SUPPORTED LANGUAGES & LOCALES
$supportedLangs = config('lang.supportedLangs', []);
$ogLocales = array_map(fn($locale) => str_replace('-', '_', $locale), $supportedLangs);

// EXPLODE NAMES
[$firstName,$lastName] = array_pad(explode(' ',G($brand,'brand.name')) ,2,'');
$shortName = strtolower($firstName);
[$country,$region] = array_pad(explode('_',G($brand,'brand.region')) ,2,'');

// DNS PREFETCH ARRAY FOR SOCIALS
$dnsPrefetch = array_map(
    fn($url) => preg_replace('#^https?://#','',$url),
    [
        config('socials.github',''),
        config('socials.vercel',''),
        config('socials.linkedin','')
    ]
);

// KNOWLEDGE ARRAY
$knowledge = config('knowledge',[]);

// META KEYS FOR SEARCH ENGINE VERIFICATION
$metaKeys = [
    'google'    => 'google-site-verification',
    'microsoft' => 'msvalidate.01',
    'yandex'    => 'yandex-verification'
];

// SAMEAS ARRAY FOR SEO
$sameAs = array_values(array_map(fn($k)=>config("socials.$k",''), ['github','vercel','linkedin','infojobs']));
?>