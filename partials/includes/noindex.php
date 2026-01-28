<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>

<!-- ENCODING, BASE & VIEWPORT -->
<meta charset="utf-8">
<?php if ($isDev): ?>
    <base href="/00_CV/">
<?php else: ?>
    <base href="/">
<?php endif; ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<!-- DESCRIPTION -->
<script nonce="<?= htmlspecialchars($GLOBALS['nonce'], ENT_QUOTES, ENT_HTML5) ?>">
    const BRAND_NICK = "<?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>"
</script>
<meta name="description" content="<?= $T('description'); ?>">

<!-- CANONICAL -->
<link rel="canonical" href="<?= htmlspecialchars($brand['url'] . ($currentLang !== 'en-GB' ? "$currentLang/" : ''), ENT_QUOTES | ENT_HTML5); ?>">

<!-- ROBOTS -->
<meta name="robots" content="noindex, nofollow">

<!-- FAVICONS -->
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="img/favicon.ico" type="image/x-icon" sizes="any">
<link rel="apple-touch-icon" href="img/favicon.png">

<!-- PRECONNECT -->
<link rel="preconnect" href="<?= $path['open-utils']; ?>" crossorigin>

<!-- THEME COLOR -->
<meta name="theme-color" content="#0a1120">

<!-- AUTHORSHIP -->
<meta name="copyright" content="© <?= htmlspecialchars(gmdate('Y'), ENT_QUOTES | ENT_HTML5); ?> <?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>">
<link type="text/plain" rel="author" href="humans.txt">

<!-- SEARCH ENGINE VERIFICATION -->
<?php foreach ($metaKeys as $key => $metaName): ?>
    <meta name="<?= htmlspecialchars($metaName, ENT_QUOTES | ENT_HTML5); ?>" content="<?= $verification['key']; ?>">
<?php endforeach; ?>

<!-- IMPORT MAP -->
<script type="importmap" nonce="<?= htmlspecialchars($GLOBALS['nonce'], ENT_QUOTES, ENT_HTML5) ?>">
    <?= json_encode(['imports' => $globals['imports'] ?? []], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); ?>
</script>

<!-- DATA HYDRATION -->
<script id="globals-data" type="application/json" nonce="<?= htmlspecialchars($GLOBALS['nonce'], ENT_QUOTES, ENT_HTML5) ?>">
    <?php
    $hydrate = $globals;
    unset($hydrate['tech']);
    echo json_encode($hydrate, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    ?>
</script>