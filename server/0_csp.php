<?php
declare(strict_types=1);

// ----------------------------
// CSP HEADER GENERATION
// ----------------------------
$nonce = bin2hex(random_bytes(32));
$GLOBALS['nonce'] = $nonce;

header("Content-Security-Policy: ".
    "default-src 'self'; ".
    "script-src 'self' 'nonce-$nonce' https://open-utils-dev-sandokan-cat.vercel.app https://www.googletagmanager.com https://www.clarity.ms https://mc.yandex.ru; ".
    "style-src 'self' https://open-utils-dev-sandokan-cat.vercel.app; ".
    "style-src-elem 'self' https://open-utils-dev-sandokan-cat.vercel.app; ".
    "connect-src 'self' https://www.googletagmanager.com https://www.clarity.ms https://mc.yandex.ru; ".
    "img-src 'self' https://sandokanCat.github.io data:; ".
    "font-src 'self'; ".
    "frame-src 'self'; ".
    "object-src 'none'; ".
    "base-uri 'self'; ".
    "form-action 'self'; ".
    "report-to csp-endpoint"
);
?>