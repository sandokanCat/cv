<!-- ENCODING, BASE & VIEWPORT -->
<meta charset="utf-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<!-- DESCRIPTION -->
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
<meta name="theme-color" content="#1d2a42">

<!-- AUTHORSHIP -->
<meta name="copyright" content="© <?= htmlspecialchars(gmdate('Y'), ENT_QUOTES | ENT_HTML5); ?>  <?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>">
<link type="text/plain" rel="author" href="humans.txt">

<!-- SEARCH ENGINE VERIFICATION -->
<?php foreach ($metaKeys as $key => $metaName): ?>
    <meta name="<?= htmlspecialchars($metaName, ENT_QUOTES | ENT_HTML5); ?>" content="<?= $verification['key']; ?>">
<?php endforeach; ?>
