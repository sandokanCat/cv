<?php
// LOAD SERVER DIRECTORY
require_once __DIR__ . '/autoload.php';

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
