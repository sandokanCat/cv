<?php
// ERROR CODE HANDLING
$code = (int)($_GET['code'] ?? 500);

// LOAD I18N HELPER
require_once __DIR__ . '/i18n.php';
$lang = detectUserLang();

// GET I18N ERROR MESSAGES
$errorsFile = __DIR__ . '/../js/data/errors.json';
$i18nErrors = json_decode(file_get_contents($errorsFile), true);

// GET MESSAGE OR FALLBACK TO 500
$errMsg = $i18nErrors[$lang][$code] ?? $i18nErrors[$lang][500] ?? "Unknown error";
$btnTxt = $i18nErrors[$lang]['return'] ?? 'Return';

// SET HTTP STATUS
http_response_code($code);
?>

<!DOCTYPE html>
<html lang="<?= htmlspecialchars($lang); ?>" dir="ltr" data-theme="light">

<head>
    <!-- CHARSET FOR UTF-8 ENCODING -->
    <meta charset="utf-8">

    <!-- BASE PATH FOR RELATIVE URL RESOLUTION -->
    <base href="/">

    <!-- RESPONSIVE VIEWPORT SETTINGS -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <!-- TITLE & META DESCRIPTION FOR SEO -->
    <title>sandokan.cat | Error <?= $code ?></title>
    <meta name="description" content="Portfolio and resume of Gonzalo Cabezas, a Fullstack developer specialized in modern web technologies">

    <!-- CANONICAL URL -->
    <link rel="canonical" href="https://sandokan.cat/">

    <!-- LANGUAGE VERSIONS -->
    <link rel="alternate" hreflang="en-GB" href="https://sandokan.cat/">
    <link rel="alternate" hreflang="es-ES" href="https://sandokan.cat/private/fallbacks/light/index.es-ES.html">
    <link rel="alternate" hreflang="ca-ES" href="https://sandokan.cat/private/fallbacks/light/index.ca-ES.html">
    <link rel="alternate" hreflang="x-default" href="https://sandokan.cat/">

    <!-- KEYWORDS FOR SEARCH ENGINES -->
    <meta name="keywords" content="Gonzalo Cabezas Núñez, sandokan.cat, Sandokan, Fullstack Dev, Full Stack Web Developer, Barcelona Web Developer, Junior Fullstack Developer, Web Portfolio, Curriculum Vitae">

    <!-- ROBOTS & INDEXING -->
    <meta name="robots" content="noindex, nofollow">
    <meta name="revisit-after" content="none">
    <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <!-- OPEN GRAPH FOR SOCIAL MEDIA -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="sandokan.cat">
    <meta property="og:title" content="Gonzalo Cabezas | Fullstack Web Developer">
    <meta property="og:description" content="Looking for a creative and efficient Fullstack developer? Discover my projects">
    <meta property="og:url" content="https://sandokan.cat/?version=2.0">
    <meta property="og:image" content="https://sandokan.cat/img/og-img.jpg?version=2.0">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="200">
    <meta property="og:image:height" content="200">
    <meta property="og:image:alt" content="Gonzalo Cabezas | Fullstack Web Developer, resume and portfolio">
    <meta property="og:locale" content="en_GB">
    <meta property="og:article:section" content="Technology, web development">
    <meta property="og:article:tag" content="Fullstack Developer">

    <!-- OPTIONAL OG PROFILE INFO -->
    <meta property="og:profile:first_name" content="Gonzalo">
    <meta property="og:profile:last_name" content="Cabezas">
    <meta property="og:profile:gender" content="male">
    <meta property="og:profile:username" content="sandokanCat">
    <meta property="og:profile:picture" content="https://sandokan.cat/img/photos/gonzalo@3x.png">

    <!-- FAVICON -->
    <link rel="icon" href="img/favicon.svg" type="image/svg+xml"> <!-- MODERN BOM -->
    <!---------------------------------------------- VOLVER AQUI --------------------------------------------------------------------->
    <link rel="icon" href="img/favicon.ico" type="image/x-icon" sizes="any"> <!-- FALLBACK, OLD BOM-->
    <link rel="apple-touch-icon" href="img/favicon.png"> <!-- APPLE TOUCH -->
    <meta name="msapplication-TileColor" content="#1d2a42"> <!-- WINDOWS 8+ THEME COLOR -->
    <meta name="msapplication-TileImage" content="img/mstile-150x150.png"> <!-- WINDOWS 8+ IMG -->

    <!-- SPECIFIC CSS -->
    <link rel="stylesheet" href="css/components/error.css">

    <!-- THEME COLOR FOR MOBILE BROWSERS -->
    <meta name="theme-color" content="#1d2a42">

    <!-- MOBILE SETTINGS -->
    <meta name="handheldFriendly" content="true">
    <meta name="mobileoptimized" content="360">
    <meta name="format-detection" content="telephone=no, address=no, date=no">

    <!-- AUTHORSHIP & CONTACT -->
    <meta name="author" content="sandokan.cat">
    <meta name="publisher" content="sandokan.cat">
    <meta name="reply-to" content="dev@sandokan.cat">
    <meta name="copyright" content="© 2025 sandokan.cat">
    <meta name="subject" content="Gonzalo Cabezas, Curriculum Vitae">
    <meta name="abstract" content="Fullstack Web Developer open to opportunities in Barcelona">
    <meta name="identifier-URL" content="https://sandokan.cat/">

    <!-- CONTENT CLASSIFICATION -->
    <meta name="category" content="Technology, web development">
    <meta name="rating" content="general">

    <!-- HUMANS TXT (CREDITS FILE) -->
    <link type="text/plain" rel="author" href="humans.txt">

    <link rel="manifest" href="manifest.json"> <!----------------------------------- VOLVER AQUI ---------------------------------------------->

    <!-- GEOLOCATION FOR LOCAL SEO -->
    <meta name="distribution" content="national">
    <meta name="geo.region" content="ES-B">
    <meta name="geo.placename" content="Barcelona">
    <meta name="geo.position" content="41.3851;2.1734">
    <meta name="ICBM" content="41.3851, 2.1734">

    <!-- SEARCH ENGINE VERIFICATION -->
    <meta name="google-site-verification" content="bSt6stKHamguB6eCCCbguxnzl5t-MGnSbyxzYzEmP5Q">
    <meta name="msvalidate.01" content="67F856661103182488C8ADE76EA02DF0">
    <meta name="yandex-verification" content="41d8a99d172f9fff">
    <!-- ADD BAIDU, NAVER AND OTHERS -->

    <!-- SCHEMA LD+JSON -->
    <script type="application/ld+json"> // MARKUP FOR THE WEBSITE IDENTITY
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://sandokan.cat/",
            "name": "sandokan.cat | Full Stack Web Developer",
            "description": "Full Stack Developer specialized in modern web technologies. Portfolio and resume"
        }
    </script>
    <script type="application/ld+json"> // MARKUP FOR THE WEBPAGE CONTENT
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "url": "https://sandokan.cat/",
            "name": "sandokan.cat | Full Stack Web Developer",
            "author": { 
                "@id": "#gonzalo"
            },
            "publisher": { 
                "@id": "#gonzalo"
            },
            "mainEntity": { 
                "@id": "#gonzalo"
            }
        }
    </script>
    <script type="application/ld+json"> // MARKUP FOR PROFESSIONAL SERVICE ENTITY
        {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "sandokan.cat | Full Stack Web Developer",
            "url": "https://sandokan.cat/",
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Web Development Services",
                "email": "dev@sandokan.cat",
                "telephone": "+34 631306583",
                "url": "https://sandokan.cat/server/contact/contact.php"
            },
            "address": {
                "@type": "PostalAddress",
                "postalCode": "08014",
                "addressLocality": "Barcelona",
                "addressRegion": "B",
                "addressCountry": "ES"
            },
            "sameAs": [
                "https://github.com/sandokanCat",
                "https://vercel.com/sandokancat"
            ],
            "areaServed": "ES",
            "founder": {
                "@id": "#gonzalo"
            },
            "foundingDate": "2025",
            "priceRange": "€"
        }          
    </script>        
    <script type="application/ld+json"> // MARKUP FOR AUTHOR PERSON ENTITY
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "#gonzalo",
            "name": "Gonzalo Cabezas Núñez",
            "jobTitle": "Full Stack Web Developer",
            "url": "https://sandokan.cat/#gonzalo",
            "image": "https://sandokan.cat/img/og-img.jpg?version=2.0",
            "sameAs": [
                "https://linkedin.com/in/sandokanCat",
                "https://www.infojobs.net/candidate/cv/view/index.xhtml?dgv=3099151168547844805"
            ],
            "knowsAbout": [
                "XML", "HTML5", "CSS3", "Vanilla JavaScript", "JSON", "AJAX", "JAVA", "PHP"
            ],
            "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Institució Pau Casals",
                "url": "https://paucasals.com",
                "logo": "https://www.paucasals.com/imagen/logo_640.png"
            }
        }
    </script>

    <!-- SPECIFIC JS -->
    <script type="module" src="js/components/error.js"></script>
</head>

<body>
    <div id="error-container">
        <header>
            <h1><?= $code ?></h1>
            <h2><?= htmlspecialchars($errMsg); ?></h2>
        </header>
        <main>
            <p><a class="icons-scale" href="/"><?= htmlspecialchars($btnTxt); ?></a></p>
        </main>
        <footer>
            <!-- SIGNATURE -->
            <p id="signature">
                <strong> © 
                    <span id="signature-year">
                        <noscript>2025</noscript>
                    </span>
                    sandokan.cat
                </strong>
            </p>
        </footer>
    </div>
</body>

</html>
