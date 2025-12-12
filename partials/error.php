<?php
// ERROR CODE HANDLING
$code = (int)($_GET['code'] ?? 500);

// LOAD I18N & GLOBALS
require_once __DIR__."/../server/autoload.php";

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
    <title><?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?> | Error <?= htmlspecialchars($code, ENT_QUOTES | ENT_HTML5); ?></title>

    <?php require_once __DIR__."/assets/noindex.php"; // LOAD NOINDEX/NOFOLLOW HEAD ?>

    <!-- SPECIFIC CSS -->
    <link rel="stylesheet" href="css/components/error.css">

    <!-- SPECIFIC JS -->
    <script type="module" src="js/components/error.js"></script>
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
        <footer>
            <?php require_once __DIR__."/assets/signature.php"; // LOAD SIGNATURE ?>
        </footer>
    </div>
</body>

</html>
