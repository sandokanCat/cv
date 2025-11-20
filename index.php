<?php
// ===============================
// LOAD I18N & GLOBALS
// ===============================
require_once __DIR__."/server/i18n.php";

// ===============================
// DETERMINE TEXT DIRECTION
// ===============================
$rtlLangs = G($globals,'lang.rtlLangs', 'html') ?? [];
$dir = in_array(substr($currentLang,0,2), $rtlLangs) ? 'rtl' : 'ltr';

// ===============================
// BASE URL & CANONICAL
// ===============================
$brandUrl = G($globals,'brand.url');
$canonicalUrl = $brandUrl . ($currentLang !== 'en-GB' ? "$currentLang/" : '');

// ===============================
// SUPPORTED LANGUAGES & LOCALES
// ===============================
$supportedLangs = G($globals,'lang.supportedLangs','html') ?? [];
$ogLocales = array_map(
    fn($locale) => str_replace('-', '_', $locale),
    $supportedLangs
);

// ===============================
// DNS PREFETCH
// ===============================
$dnsPrefetch = array_map(
    fn($url) => preg_replace('#^https?://#','', $url),
    [
        G($globals,'socials.github','html'),
        G($globals,'socials.vercel','html'),
        G($globals,'socials.linkedin','html')
    ]
);

// ===============================
// KNOWLEDGE & SEO META KEYS
// ===============================
$knowledge = G($globals,'knowledge','json') ?? [];

$metaKeys = [
    'google'    => 'google-site-verification',
    'microsoft' => 'msvalidate.01',
    'yandex'    => 'yandex-verification'
];

// ===============================
// INIT HTML5
// ===============================
?>
<!DOCTYPE html>
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>" dir="<?= $dir; ?>" data-theme="light">

<?php 
// HEAD
require_once __DIR__."/partials/head.php"; 
?>

<body>
    <div id="site-wrapper">
        <?php 
        // HEADER
        require_once __DIR__."/partials/body/header.php"; 

        // MAIN PANELS
        ?>
        <main>
            <?php require_once __DIR__."/partials/body/main/leftPanel.php"; ?>
            <?php require_once __DIR__."/partials/body/main/rightPanel.php"; ?>
            <?php require_once __DIR__."/partials/body/main/bottomContainer.php"; ?>
        </main>

        <?php 
        // FOOTER
        require_once __DIR__."/partials/body/footer.php"; 
        ?>
    </div>

    <?php 
    // MODALS
    require_once __DIR__."/partials/body/modal.php"; 
    ?>
</body>

</html>
