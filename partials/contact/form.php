<?php
// LOAD I18N & GLOBALS
require_once __DIR__.'/../../server/autoload.php';

// LOAD DEPENDENCIES
require_once __DIR__.'/../../app/PHPdotenv/vendor/autoload.php';
require_once __DIR__.'/../../app/PHPMailer/src/PHPMailer.php';
require_once __DIR__.'/../../app/PHPMailer/src/SMTP.php';
require_once __DIR__.'/../../app/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// LOAD .ENV
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
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
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>" dir="<?= htmlspecialchars($dir, ENT_QUOTES | ENT_HTML5); ?>" data-theme="light">
    
<head>
    <title><?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?> | Contact</title>

    <?php require_once __DIR__."/../assets/noindex.php"; // LOAD NOINDEX/NOFOLLOW HEAD ?>

    <!-- SPECIFIC CSS -->
    <link rel="stylesheet" href="css/components/form.css">

    <!-- SPECIFIC JS -->
    <script type="module" src="js/components/form.js"></script>
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
    $lang = htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
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
    <footer>
        <?php require_once __DIR__."/../assets/signature.php"; // LOAD SIGNATURE ?>
    </footer>
</body>

</html>
