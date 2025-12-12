<head>
    <!-- ENCODING, BASE & VIEWPORT -->
    <meta charset="utf-8">
    <?php if ($isDev): ?>
        <base href="/00_CV/">
    <?php else: ?>
        <base href="/">
    <?php endif; ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <!-- TITLE & DESCRIPTION -->
    <script nonce="<?= htmlspecialchars($GLOBALS['nonce'], ENT_QUOTES, ENT_HTML5) ?>">
        const BRAND_NICK = "<?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>"
    </script>
    <title data-i18n="title"><?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?> | <?= $T('brand.role') ?></title>
    <meta name="description" content="<?= $T('description'); ?>">

    <!-- CANONICAL -->
    <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5); ?>">

    <!-- LANGUAGE VERSIONS -->
    <?php foreach ($opLang as $langCode => $locale): 
        $code = is_array($locale) ? ($locale[0] ?? 'en-GB') : $locale;
        $url = $brand['url'] . ($code !== 'en-GB' ? "{$code}/" : '');?>
        <link rel="alternate" hreflang="<?= htmlspecialchars($langCode); ?>" href="<?= htmlspecialchars($url, ENT_QUOTES | ENT_HTML5); ?>">
    <?php endforeach; ?>
    <link rel="alternate" hreflang="x-default" href="<?= htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5); ?>">

    <!-- ROBOTS -->
    <meta name="robots" content="index, follow">

    <!-- OPEN GRAPH -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>">
    <meta property="og:title" content="<?= $T('ogTitle'); ?>">
    <meta property="og:description" content="<?= $T('ogDescription'); ?>">
    <meta property="og:url" content="<?= htmlspecialchars($brand['url'], ENT_QUOTES | ENT_HTML5); ?>">
    <meta property="og:image" content="<?= htmlspecialchars($brand['url'], ENT_QUOTES | ENT_HTML5); ?>img/og-img.jpg?version=2.0">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="200">
    <meta property="og:image:height" content="200">
    <meta property="og:image:alt" content="<?= $T('ogImageAlt'); ?>">
    <meta property="og:locale" content="<?= htmlspecialchars($ogLocales[$currentLang] ?? 'en_GB', ENT_QUOTES | ENT_HTML5); ?>">
    <?php foreach ($ogLocales as $lang => $ogLocale):
        if ($lang !== $currentLang): ?>
            <meta property="og:locale:alternate" content="<?= htmlspecialchars($ogLocale, ENT_QUOTES | ENT_HTML5); ?>">
    <?php endif; endforeach; ?>

    <!-- FAVICONS -->
    <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="img/favicon.ico" type="image/x-icon" sizes="any">
    <link rel="apple-touch-icon" href="img/favicon.png">

    <!-- PRECONNECT & DNS-PREFETCH -->
    <link rel="preconnect" href="<?= $path['open-utils']; ?>" crossorigin>
    <?php foreach ($dnsPrefetch as $url): ?>
        <link rel="dns-prefetch" href="<?= htmlspecialchars($url, ENT_QUOTES | ENT_HTML5); ?>">
    <?php endforeach; ?>
    <link rel="dns-prefetch" href="https://<?= htmlspecialchars($brand['user'], ENT_QUOTES | ENT_HTML5); ?>.github.io">

    <!-- MAIN CSS -->
    <link rel="stylesheet" href="css/styles.css">

    <!-- THEME COLOR -->
    <meta name="theme-color" content="#1d2a42">

    <!-- AUTHORSHIP -->
    <meta name="copyright" content="© <?= htmlspecialchars(gmdate('Y'), ENT_QUOTES | ENT_HTML5); ?> <?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>">
    <link type="text/plain" rel="author" href="humans.txt">

    <!-- SEARCH ENGINE VERIFICATION -->
    <?php foreach ($metaKeys as $metaName => $metaContent): ?>
        <meta name="<?= htmlspecialchars($metaName, ENT_QUOTES | ENT_HTML5); ?>" content="<?= htmlspecialchars($metaContent, ENT_QUOTES | ENT_HTML5); ?>">
    <?php endforeach; ?>

    <!-- SCHEMA LD+JSON -->
    <script type="application/ld+json">
        <?= json_encode([
            "@context" => "https://schema.org",
            "@type" => "WebSite",
            "url" => $brand['url'],
            "name" => $T('ldJsonWebName'),
            "description" => $T('ldJsonWebDescription'),
            "author" => ["@id" => "#".$shortName],
            "publisher" => ["@id" => "#".$shortName],
            "mainEntity" => ["@id" => "#".$shortName]
        ], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); ?>
    </script>
    <script type="application/ld+json">
        <?= json_encode([
            "@context" => "https://schema.org",
            "@type" => "Person",
            "@id" => "#".$shortName,
            "name" => $brand['name'],
            "jobTitle" => $T('ldJsonJobTitle'),
            "url" => $brand['url']."#".$shortName,
            "contactPoint" => [
                "@type" => "ContactPoint",
                "contactType" => $T('ldJsonContactType'),
                "email" => $brand['email'],
                "telephone" => $brand['tel'],
                "url" => $brand['url']."partials/contact/form.php"
            ],
            "address" => [
                "@type" => "PostalAddress",
                "postalCode" => $brand['postal'],
                "addressLocality" => $brand['city'],
                "addressRegion" => $region,
                "addressCountry" => $country
            ],
            "image" => $brand['url']."img/photos/".$shortName."@3x.png",
            "sameAs" => $sameAs,
            "knowsAbout" => $knowsAbout,
            "alumniOf" => $alumniOf
        ], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); ?>
    </script>

    <!-- MAIN JS -->
    <script type="module" src="js/main.js"></script>
</head>