<?php
require_once '/app/PHPdotenv/vendor/autoload.php';

require_once '/app/PHPMailer/src/PHPMailer.php';
require_once '/app/PHPMailer/src/SMTP.php';
require_once '/app/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// LOAD .ENV
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header('Content-Type: application/json; charset=utf-8');
    
    // SANITIZE INPUTS
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
    $content = htmlspecialchars($_POST['content'] ?? '');
    // $consent = !empty($_POST['consent']);

    // BASIC VALIDATION
    if (!$email) {
        echo json_encode(['result' => 'Error', 'error' => 'Invalid email address']);
        exit;
    } elseif (empty($name) || empty($subject) || empty($content)) {
        echo json_encode(['result' => 'Error', 'error' => 'Missing required fields']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP CONFIG
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USER'];
        $mail->Password = $_ENV['MAIL_PASS'];
        $mail->SMTPSecure = ($_ENV['MAIL_SECURE'] === 'tls') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = (int)$_ENV['MAIL_PORT'];
        $mail->CharSet = 'UTF-8';

        // HEADERS
        $mail->setFrom($_ENV['MAIL_FROM'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($_ENV['MAIL_TO'], $_ENV['MAIL_TO_NAME']);
        $mail->addCC($email, $name);
        $mail->addReplyTo($email, $name);

        // BODY
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "
            <p>Nombre: <strong>$name</strong></p>
            <p>Email: <strong>$email</strong></p>
            <p>Asunto: <strong>$subject</strong></p>
            <p>Mensaje: <br/><strong>$content</strong></p>
        ";
        $mail->AltBody = strip_tags($mail->Body);

        // SEND MAIL
        if ($mail->send()) {
            echo json_encode(['result' => 'OK']);
        } else {
            echo json_encode(['result' => 'Error', 'error' => 'Error sending E-mail: ' . $mail->ErrorInfo]);
        }
    } catch (Exception $err) {
        echo json_encode(['result' => 'Error', 'error' => 'Exception: ' . $err->getMessage()]);
    }
}
?>

<!DOCTYPE html>
<html lang="en-GB" dir="ltr" data-theme="light">
    
<head>
    <!-- CHARSET FOR UTF-8 ENCODING -->
    <meta charset="utf-8">
    
    <!-- BASE PATH FOR RELATIVE URL RESOLUTION -->
    <base href="/">
    
    <!-- RESPONSIVE VIEWPORT SETTINGS -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    
    <!-- TITLE & META DESCRIPTION FOR SEO -->
    <title data-i18n="title">sandokan.cat | Contacto</title>
    <meta name="description" content="Portfolio and resume of Gonzalo Cabezas, a Fullstack developer specialized in modern web technologies">
    
    <!-- CANONICAL URL -->
    <link rel="canonical" href="https://sandokan.cat/">
    
    <!-- LANGUAGE VERSIONS -->
    <link rel="alternate" hreflang="en-GB" href="https://sandokan.cat/">
    <link rel="alternate" hreflang="es-ES" href="https://sandokan.cat/private/fallbacks/light/index.es-ES.html">
    <link rel="alternate" hreflang="ca-ES" href="https://sandokan.cat/private/fallbacks/light/index.ca-ES.html">
    <link rel="alternate" hreflang="x-default" href="https://sandokan.cat/">
    
    <!-- KEYWORDS FOR SEARCH ENGINES -->
    <meta name="keywords" content="Gonzalo Cabezas Núñez, sandokan.cat, Sandokan, Fullstack Dev, Full Stack Web Developer, Barcelona Web Developer, Junior Fullstack Developer, Web portfolio, Curriculum Vitae">
    
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
    <link rel="stylesheet" href="css/components/contact.css">
    
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
    <script type="module" src="js/components/contact.js"></script>
</head>

<body>

    <?php
    // LOAD XML FORM AND PREVENT XXE
    $form = simplexml_load_file("form.xml", "SimpleXMLElement", LIBXML_NONET);

    // VALIDATE AND SANITIZE FORM ACTION
    $rawAction = trim((string)$form['action']);
    $allowedHost = 'sandokan.cat';
    $parsed = parse_url($rawAction);
    if (
        empty($rawAction) ||
        preg_match('/^(javascript:|data:)/i', $rawAction) ||
        (isset($parsed['host']) && $parsed['host'] !== $allowedHost)
    ) $rawAction = 'server/contact/form.php';
    $action = htmlspecialchars($rawAction, ENT_QUOTES | ENT_HTML5, 'UTF-8');    

    // CHECK SUPPORTED METHODS AND SANITIZE
    $allowedMethods = ['GET', 'POST'];
    $method = trim((string)$form['method']);
    if (!in_array($method, $allowedMethods, true)) {
        $method = 'POST';
    }
    $method = htmlspecialchars($method, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // CHECK SUPPORTED ENCTYPES AND SANITIZE
    $allowedEnctypes = [
        'application/x-www-form-urlencoded',
        'multipart/form-data'
    ];
    $enctype = strtolower((string)$form['enctype']);
    if (!in_array($enctype, $allowedEnctypes, true)) {
        $enctype = 'application/x-www-form-urlencoded';
    }
    $enctype = htmlspecialchars($enctype, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // LOAD I18N HELPER AND SANITIZE LANG
    require_once __DIR__ . '/i18n.php';
    $lang = htmlspecialchars((string)detectUserLang(), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    // START FORM
    echo "<form action='$action' method='$method' enctype='$enctype'>";

    // PRINT FORM FIELDS
    foreach ($form->field as $field){
        // SANITIZE NAME
        $name = htmlspecialchars((string)$field->name, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // CHECK SUPPORTED TYPES AND SANITIZE
        $allowedTypes = ['text', 'email', 'textarea', 'checkbox', 'submit', 'password', 'number', 'url'];
        $type = (string)$field->type;
        if (!in_array($type, $allowedTypes, true)) {
            $type = 'text';
        }
        $type = htmlspecialchars($type, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // CHECK AND SANITIZE IF REQUIRED
        $required = (isset($field['required']) && (string)$field['required'] === 'true') ? 'required' : '';
        $required = htmlspecialchars($required, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // FIND LABEL FOR CURRENT LANG AND SANITIZE
        $label = '';
        foreach ($field->label as $lbl) {
            if ((string)$lbl['lang'] === $lang) {
                $label = (string)$lbl;
                break;
            }
        }
        if (!$label) { // FALLBACK TO en-GB IF NOT FOUND
            foreach ($field->label as $lbl) {
                if ((string)$lbl['lang'] === 'en-GB') {
                    $label = (string)$lbl;
                    break;
                }
            }
        }
        if (!$label && isset($field->label[0])) { // IF STILL EMPTY, USE FIRST AVAILABLE
            $label = (string)$field->label[0];
        }
        $label = htmlspecialchars($label, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // PRINT FIELD BASED ON NAME
        switch ($name) {
            case 'content':
                echo "
                <label for='$name'>$label</label>
                <$type id='$name' name='$name' $required></$type>
            ";
                break;

            case 'consent':
                echo "
                    <div>
                        <input id='$name' name='$name' type='$type' value='1'>
                        <label id='check-consent' for='$name'>$label</label>
                    </div>
                ";
                break;

            case 'send':
                echo "
                    <input id='$name' class='icons-scale' name='$name' type='$type' value='$label'>
                ";
                break;

            default:
                echo "
                    <label for='$name'>$label</label>
                    <input id='$name' name='$name' type='$type' $required>
                ";
        };
    }
    ?>

    </form>
</body>

</html>
