<?php
// BASE URL & CANONICAL
$brandUrl = G($globals,'brand.url');
$canonicalUrl = $brandUrl . ($currentLang !== 'en-GB' ? "$currentLang/" : '');

// SUPPORTED LANGUAGES & LOCALES
$supportedLangs = G($globals,'lang.supportedLangs','html') ?? [];
$ogLocales = array_map(
    fn($locale) => str_replace('-', '_', $locale),
    $supportedLangs
);

// DNS PREFETCH
$dnsPrefetch = array_map(
    fn($url) => preg_replace('#^https?://#','', $url),
    [
        G($globals,'socials.github','html'),
        G($globals,'socials.vercel','html'),
        G($globals,'socials.linkedin','html')
    ]
);

// KNOWLEDGE & SEO META KEYS
$knowledge = G($globals,'knowledge','json') ?? [];

$metaKeys = [
    'google'    => 'google-site-verification',
    'microsoft' => 'msvalidate.01',
    'yandex'    => 'yandex-verification'
];

// PREPARE SAMEAS ARRAY
$sameAs = array_values(array_map(function($k) use ($globals) {
    return G($globals, "socials.$k", 'json') ?? '';
}, ['github','vercel','linkedin','infojobs']));
?>