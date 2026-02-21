<?php declare(strict_types=1);

// SECURITY ENTRY POINT
define('ENTRY_POINT', true);
define('IS_ERROR_PAGE', true);

// LOAD SERVER DIRECTORY
require_once __DIR__ . '/../../server/autoload.php';

// LOAD DEPENDENCIES
require_once __DIR__ . '/../../app/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../../app/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/../../app/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// PREVENT BROWSERS FROM CACHING THE REDIRECT OR THE FORM
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// CHECK IF LOADED INSIDE AN IFRAME OR FETCH
$fetchDest = $_SERVER['HTTP_SEC_FETCH_DEST'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $fetchDest === 'document') {
    http_response_code(403);
    // Use Vary to tell the browser this response depends on the fetch destination
    header('Vary: Sec-Fetch-Dest');
    header('Location: /partials/error.php?code=403');
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // START OUTPUT BUFFER TO PREVENT NOTICES FROM CORRUPTING JSON
    ob_start();
    header('Content-Type: application/json; charset=utf-8');

    // SANITIZE INPUTS
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
    $content = htmlspecialchars($_POST['content'] ?? '');
    $consent = !empty($_POST['consent']);

    // BASIC VALIDATION
    if (!$email) {
        http_response_code(400);
        ob_end_clean();
        echo json_encode(['result' => 'Error', 'error' => 'Invalid email address']);
        exit;
    } elseif (empty($name) || empty($subject) || empty($content)) {
        http_response_code(400);
        ob_end_clean();
        echo json_encode(['result' => 'Error', 'error' => 'Missing required fields']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // GET VARIABLES WITH FALLBACKS
        $mailHost = $_ENV['MAIL_HOST'] ?? getenv('MAIL_HOST');
        $mailUser = $_ENV['MAIL_USER'] ?? getenv('MAIL_USER');
        $mailUserName = $_ENV['MAIL_USER_NAME'] ?? getenv('MAIL_USER_NAME');
        $mailPass = $_ENV['MAIL_PASS'] ?? getenv('MAIL_PASS');
        $mailSecure = $_ENV['MAIL_SECURE'] ?? getenv('MAIL_SECURE');
        $mailPort = $_ENV['MAIL_PORT'] ?? getenv('MAIL_PORT');
        $brandUrl = $brand['url'] ?? '';
        $brandNick = $brand['nick'] ?? '';

        // SMTP CONFIG
        $mail->isSMTP();
        $mail->Host = $mailHost;
        $mail->SMTPAuth = true;
        $mail->Username = $mailUser;
        $mail->Password = $mailPass;
        $mail->SMTPSecure = ($mailSecure === 'tls') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = (int) $mailPort;
        $mail->CharSet = 'UTF-8';

        // 1. SEND EMAIL TO SITE OWNER
        $mail->setFrom($mailUser, $mailUserName);
        $mail->addAddress($mailUser, $brandNick);
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "
            <h2>Nuevo mensaje desde el formulario de contacto</h2>
            <p><strong>Nombre:</strong> $name</p>
            <p><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
            <p><strong>Asunto:</strong> $subject</p>
            <p><strong>Mensaje:</strong> <br/>" . nl2br($content) . "</p>
        ";
        $mail->AltBody = strip_tags($mail->Body);

        $mail->send();

        // 2. SEND AUTO-REPLY TO SENDER
        $mail->clearAllRecipients();
        $mail->clearReplyTos();

        $mail->setFrom($mailUser, $mailUserName);
        $mail->addAddress($email, $name);

        $mail->Subject = "Re: $subject";
        $replyBody = "
            <h2>¡Hola <strong>$name</strong>!</h2>
            <p>He recibido tu mensaje correctamente y te responderé lo antes posible.</p>
            <p>Aquí tienes una copia de lo que enviaste:</p>
            <blockquote style='border-left: 4px solid #ccc; padding-left: 10px; color: #555;'>
                " . nl2br($content) . "
            </blockquote>
            <p>Un saludo.</p>
            <a href='$brandUrl' target='_blank'>$brandNick</a>
        ";

        $mail->Body = $replyBody;
        $mail->AltBody = strip_tags(str_replace(['<br>', '</p>'], "\n", $replyBody));

        $mail->send();

        // RETURN SUCCESS
        ob_end_clean();
        echo json_encode(['result' => 'OK']);

    } catch (Exception $err) {
        $errorMsg = $mail->ErrorInfo ?: $err->getMessage();
        ob_end_clean();
        echo json_encode(['result' => 'Error', 'error' => 'Error sending E-mail: ' . $errorMsg]);
    }
    exit;
}
?>

<!DOCTYPE html>
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>" dir="<?= htmlspecialchars($dir, ENT_QUOTES | ENT_HTML5); ?>" data-theme="dark">

<?php
$isForm = true;
require_once __DIR__ . "/../head.php"; // LOAD HEAD
?>

<body>
    <?php
    // LOAD XML FORM AND PREVENT XXE
    $form = simplexml_load_file("form.xml", "SimpleXMLElement", LIBXML_NONET);

    // VALIDATE AND SANITIZE FORM ACTION
    $rawAction = trim((string) $form['action']);
    $allowedHost = 'sandokan.cat';
    $parsed = parse_url($rawAction);

    // For testing purposes, if the specified action doesn't exist or is the default non-functional one,
    // we use the current script since it contains the POST handler logic.
    if (
        empty($rawAction) ||
        $rawAction === 'partials/contact/form.php' ||
        preg_match('/^(javascript:|data:)/i', $rawAction) ||
        (isset($parsed['host']) && $parsed['host'] !== $allowedHost)
    ) {
        $rawAction = htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    $action = $rawAction;

    // CHECK SUPPORTED METHODS AND SANITIZE
    $allowedMethods = ['GET', 'POST'];
    $method = trim((string) $form['method']);
    if (!in_array($method, $allowedMethods, true)) {
        $method = 'POST';
    }
    $method = htmlspecialchars($method, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // CHECK SUPPORTED ENCTYPES AND SANITIZE
    $allowedEnctypes = [
        'application/x-www-form-urlencoded',
        'multipart/form-data'
    ];
    $enctype = strtolower((string) $form['enctype']);
    if (!in_array($enctype, $allowedEnctypes, true)) {
        $enctype = 'application/x-www-form-urlencoded';
    }
    $enctype = htmlspecialchars($enctype, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // LOAD I18N HELPER AND SANITIZE LANG
    $lang = htmlspecialchars($currentLang ?? 'en-GB', ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // FIND THE CORRECT LANGUAGE BLOCK
    $selectedLangNode = null;
    foreach ($form->lang as $l) {
        if ((string) $l['locale'] === $lang) {
            $selectedLangNode = $l;
            break;
        }
    }

    // FALLBACK TO FIRST LANGUAGE IF NOT FOUND
    if (!$selectedLangNode && isset($form->lang[0])) {
        $selectedLangNode = $form->lang[0];
    }

    // START FORM
    ?>
    <div id='form-response' class='form-message' style='display:none;'></div>
    <form id='contact-form' action='<?= htmlspecialchars($action, ENT_QUOTES | ENT_HTML5) ?>' method='<?= htmlspecialchars($method, ENT_QUOTES | ENT_HTML5) ?>' enctype='<?= htmlspecialchars($enctype, ENT_QUOTES | ENT_HTML5) ?>'>
        <?php
        if ($selectedLangNode) {
            // PRINT FORM FIELDS
            foreach ($selectedLangNode->field as $field) {
                // SANITIZE NAME
                $name = htmlspecialchars((string) $field->name, ENT_QUOTES | ENT_HTML5, 'UTF-8');

                // CHECK SUPPORTED TYPES AND SANITIZE
                $allowedTypes = ['text', 'email', 'textarea', 'checkbox', 'submit', 'reset', 'password', 'number', 'url'];
                $type = (string) $field->type;
                if (!in_array($type, $allowedTypes, true)) {
                    $type = 'text';
                }
                $type = htmlspecialchars($type, ENT_QUOTES | ENT_HTML5, 'UTF-8');

                // CHECK AND SANITIZE IF REQUIRED
                $required = (isset($field['required']) && (string) $field['required'] === 'true') ? 'required' : '';
                $required = htmlspecialchars($required, ENT_QUOTES | ENT_HTML5, 'UTF-8');

                // GET LABEL
                $label = htmlspecialchars((string) $field->label, ENT_QUOTES | ENT_HTML5, 'UTF-8');

                // PRINT FIELD BASED ON TYPE AND NAME
                switch ($type) {
                    case 'email':
                        echo "
                        <div class='form-group group-$name'>
                            <label for='$name'>$label</label>
                            <input id='$name' name='$name' type='email' $required inputmode='email'>
                        </div>
                        ";
                        break;

                    case 'textarea':
                        echo "
                        <div class='form-group group-$name'>
                            <label for='$name'>$label</label>
                            <textarea id='$name' name='$name' $required inputmode='text'></textarea>
                        </div>
                        ";
                        break;

                    case 'checkbox':
                        echo "
                        <div class='form-group group-$name'>
                            <input id='$name' name='$name' type='checkbox' value='1' $required>
                            <label id='check-consent' for='$name'>$label</label>
                        </div>
                        ";
                        break;

                    case 'submit':
                    case 'reset':
                        echo "
                        <div class='form-group group-$name'>
                            <input id='$name' class='icons-snippet active' name='$name' type='$type' value='$label'>
                        </div>
                        ";
                        break;

                    default:
                        echo "
                        <div class='form-group group-$name'>
                            <label for='$name'>$label</label>
                            <input id='$name' name='$name' type='$type' $required>
                        </div>
                        ";
                }
            }
        }

        require_once __DIR__ . "/../includes/signature.php"; // LOAD SIGNATURE
        ?>
    </form>
</body>

</html>