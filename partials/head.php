<head>
    <!-- CHARSET -->
    <meta charset="utf-8">

    <!-- BASE URL -->
    <base href="/">

    <!-- VIEWPORT -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <!-- TITLE & DESCRIPTION -->
    <title data-i18n="title"><?= $T('title'); ?></title>
    <meta name="description" content="<?= $T('description'); ?>">

    <!-- CANONICAL -->
    <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5); ?>">

    <!-- LANGUAGE VERSIONS -->
    <?php foreach ($supportedLangs as $lang => $locale): 
        $url = $brandUrl . ($locale !== 'en-GB' ? "$locale/" : '');
    ?>
        <link rel="alternate" hreflang="<?= htmlspecialchars($lang); ?>" href="<?= htmlspecialchars($url, ENT_QUOTES | ENT_HTML5); ?>">
    <?php endforeach; ?>
    <link rel="alternate" hreflang="x-default" href="<?= htmlspecialchars($canonicalUrl, ENT_QUOTES | ENT_HTML5); ?>">

    <!-- ROBOTS -->
    <meta name="robots" content="index, follow">

    <!-- OPEN GRAPH -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= G($globals,'brand.nick','html'); ?>">
    <meta property="og:title" content="<?= $T('ogTitle'); ?>">
    <meta property="og:description" content="<?= $T('ogDescription'); ?>">
    <meta property="og:url" content="<?= G($globals,'brand.url','html'); ?>">
    <meta property="og:image" content="<?= G($globals,'brand.url','html'); ?>img/og-img.jpg?version=2.0">
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
    <link rel="preconnect" href="<?= G($globals,'sources','html'); ?>" crossorigin>
    <?php foreach ($dnsPrefetch as $url): ?>
        <link rel="dns-prefetch" href="//<?= $url; ?>">
    <?php endforeach; ?>
    <link rel="dns-prefetch" href="//<?= G($globals,'brand.user','html'); ?>.github.io/">
    <link rel="dns-prefetch" href="<?= G($globals,'cookies','html'); ?>">

    <!-- MAIN CSS -->
    <link rel="preload" href="css/styles.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/styles.css"></noscript>

    <!-- THEME COLOR -->
    <meta name="theme-color" content="#1d2a42">

    <!-- AUTHORSHIP -->
    <meta name="copyright" content="© <?= gmdate('Y'); ?> <?= G($globals,'brand.nick','html'); ?>">
    <link type="text/plain" rel="author" href="humans.txt">

    <!-- SEARCH ENGINE VERIFICATION -->
    <?php foreach ($metaKeys as $key => $metaName): ?>
        <meta name="<?= htmlspecialchars($metaName, ENT_QUOTES | ENT_HTML5); ?>" content="<?= G($globals,"verification.$key",'html'); ?>">
    <?php endforeach; ?>

    <!-- SCHEMA LD+JSON -->
    <script type="application/ld+json">
        <?= json_encode([
            "@context" => "https://schema.org",
            "@type" => "WebSite",
            "url" => $brandUrl,
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
            "name" => G($globals,'brand.name','json'),
            "jobTitle" => $T('ldJsonJobTitle'),
            "url" => G($globals,'brand.url','json')."#".$shortName,
            "contactPoint" => [
                "@type" => "ContactPoint",
                "contactType" => $T('ldJsonContactType'),
                "email" => G($globals,'brand.email','json'),
                "telephone" => "+34 631306583",
                "url" => G($globals,'brand.url','json')."partials/contact/form.php"
            ],
            "address" => [
                "@type" => "PostalAddress",
                "postalCode" => G($globals,'brand.postalCode'),
                "addressLocality" => G($globals,'brand.placename','json'),
                "addressRegion" => $region,
                "addressCountry" => $country
            ],
            "image" => G($globals,'brand.url','json')."img/og-img.jpg",
            "sameAs" => $sameAs,
            "knowsAbout" => array_map(fn($k) => ["@type" => "Thing","name" => $k], $knowledge),
            "alumniOf" => [
                "@type" => "EducationalOrganization",
                "name" => G($globals,'academy.name','json'),
                "url" => G($globals,'academy.url','json'),
                "logo" => G($globals,'academy.logo','json')
            ]
        ], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); ?>
    </script>

    <!-- MAIN JS -->
    <link rel="preload" href="js/main.js" as="script">
    <script type="module" src="js/main.js" defer></script>
</head>
