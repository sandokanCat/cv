<?php
// ERROR CODE HANDLING
$code = (int)($_GET['code'] ?? 500);

// LOAD I18N & GLOBALS
require_once __DIR__."/server/i18n.php";

// LOAD ASSETS
require_once __DIR__."/server/assets.php";

// GET I18N ERROR MESSAGES
$errorsFile = __DIR__ . '/js/data/errors.json';
$i18nErrors = json_decode(file_get_contents($errorsFile), true);

// GET MESSAGE OR FALLBACK TO 500
$errMsg = $i18nErrors[$currentLang][$code] ?? $i18nErrors[$currentLang][500] ?? "Unknown error";
$btnTxt = $i18nErrors[$currentLang]['return'] ?? 'Return';

// SET HTTP STATUS
http_response_code($code);
?>

<!DOCTYPE html>
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>" dir="<?= htmlspecialchars($dir, ENT_QUOTES | ENT_HTML5); ?>" data-theme="light">

<head>
    <!-- CHARSET -->
    <meta charset="utf-8">

    <!-- BASE URL -->
    <base href="/">

    <!-- VIEWPORT -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <!-- TITLE & DESCRIPTION -->
    <title>sandokan.cat | Error <?= htmlspecialchars($code, ENT_QUOTES | ENT_HTML5); ?></title>
    <meta name="description" content="<?= $T('description'); ?>">

    <!-- CANONICAL -->
    <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5); ?>">

    <!-- ROBOTS -->
    <meta name="robots" content="noindex, nofollow">

    <!-- FAVICONS -->
    <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="img/favicon.ico" type="image/x-icon" sizes="any">
    <link rel="apple-touch-icon" href="img/favicon.png">

    <!-- PRECONNECT -->
    <link rel="preconnect" href="<?= G($globals,'sources','html'); ?>" crossorigin>

    <!-- SPECIFIC CSS -->
    <link rel="preload" href="css/components/error.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/components/error.css"></noscript>

    <!-- THEME COLOR -->
    <meta name="theme-color" content="#1d2a42">

    <!-- AUTHORSHIP -->
    <meta name="copyright" content="© 2025 sandokan.cat">
    <link type="text/plain" rel="author" href="humans.txt">

    <!-- SEARCH ENGINE VERIFICATION -->
    <?php foreach ($metaKeys as $key => $metaName): ?>
        <meta name="<?= htmlspecialchars($metaName, ENT_QUOTES | ENT_HTML5); ?>" content="<?= G($globals,"verification.$key",'html'); ?>">
    <?php endforeach; ?>

    <!-- SPECIFIC JS -->
    <link rel="preload" href="js/components/error.js" as="script">
    <script type="module" src="js/components/error.js" defer></script>
</head>

<body>
    <div id="error-container">
        <header>
            <h1><?= $code ?></h1>
            <h2><?= htmlspecialchars($errMsg, ENT_QUOTES | ENT_HTML5); ?></h2>
        </header>
        <main>
            <p><a class="icons-scale" href="/"><?= htmlspecialchars($btnTxt, ENT_QUOTES | ENT_HTML5); ?></a></p>
        </main>
        <footer> <!-- SIGNATURE -->
            <p id="signature">
                <strong> © 
                    <span id="signature-year">
                        <noscript><?= htmlspecialchars(gmdate('Y'), ENT_QUOTES | ENT_HTML5); ?></noscript>
                    </span>
                    sandokan.cat
                </strong>
            </p>
        </footer>
    </div>
</body>

</html>
