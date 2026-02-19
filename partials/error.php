<?php declare(strict_types=1);

// SECURITY ENTRY POINT
define('ENTRY_POINT', true);
define('IS_ERROR_PAGE', true);

// LOAD SERVER DIRECTORY
require_once __DIR__ . '/../server/autoload.php';

// ERROR CODE HANDLING
$code = (int) ($_GET['code'] ?? 500);

// GET I18N ERROR MESSAGES
$errorsFile = __DIR__ . '/../js/data/errors.json';
$i18nErrors = json_decode(file_get_contents($errorsFile), true);

// GET MESSAGE OR FALLBACK TO 500
$errMsg = $i18nErrors[$currentLang][$code] ?? $i18nErrors[$currentLang][500] ?? "Unknown error";
$btnTxt = $i18nErrors[$currentLang]['return'] ?? 'Return';

// SET HTTP STATUS
http_response_code($code);
?>

<!DOCTYPE html>
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>" dir="<?= htmlspecialchars($dir, ENT_QUOTES | ENT_HTML5); ?>" data-theme="dark">

<?php
$isError = true;
require_once __DIR__ . "/head.php"; // LOAD HEAD
?>

<body>
    <?php require_once __DIR__ . "/body/header.php"; // LOAD HEADER ?>
    <main id="error-container">
        <h1><?= $code ?></h1>
        <h2 data-i18n="<?= $code ?>"><?= htmlspecialchars($errMsg, ENT_QUOTES | ENT_HTML5); ?></h2>
        <p id="return-btn-wrapper">
            <a class="icons-snippet active icons-color-2" href="<?= htmlspecialchars($brand['url'], ENT_QUOTES | ENT_HTML5); ?>" data-i18n="return"><?= htmlspecialchars($btnTxt, ENT_QUOTES | ENT_HTML5); ?></a>
        </p>
        <?php require_once __DIR__ . "/includes/signature.php"; // LOAD SIGNATURE ?>
    </main>
    <?php require_once __DIR__ . "/body/footer.php"; // LOAD FOOTER ?>
</body>

</html>