<?php
declare(strict_types=1);

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

// LOAD SERVER DIRECTORY
require_once __DIR__ . '/server/autoload.php';

// INIT HTML5
?>
<!DOCTYPE html>
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>" dir="<?= htmlspecialchars($dir, ENT_QUOTES | ENT_HTML5); ?>" data-theme="light">

<?php require_once __DIR__."/partials/head.php"; // LOAD HEAD ?>

<body>
    <div id="site-wrapper">
        <?php require_once __DIR__."/partials/body/header.php"; // LOAD HEADER ?>
        <main>
            <?php // LOAD MAIN PANELS
            require_once __DIR__."/partials/body/main/leftPanel.php";
            require_once __DIR__."/partials/body/main/rightPanel.php";
            require_once __DIR__."/partials/body/main/bottomContainer.php";
            ?>
        </main>

        <?php require_once __DIR__."/partials/body/footer.php"; // LOAD FOOTER ?>
    </div>

    <?php require_once __DIR__."/partials/body/modal.php"; // LOAD MODAL ?>
</body>

</html>
