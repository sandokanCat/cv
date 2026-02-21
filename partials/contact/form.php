<?php declare(strict_types=1);

// SECURITY ENTRY POINT
define('ENTRY_POINT', true);
define('IS_ERROR_PAGE', true); // Bypass router redirection for direct testing

// LOAD SERVER DIRECTORY
require_once __DIR__ . '/../../server/autoload.php';

// LOAD DEPENDENCIES
require_once __DIR__ . '/../../app/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../../app/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/../../app/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
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
        echo json_encode(['result' => 'Error', 'error' => 'Invalid email address']);
        exit;
    } elseif (empty($name) || empty($subject) || empty($content)) {
        http_response_code(400);
        echo json_encode(['result' => 'Error', 'error' => 'Missing required fields']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP CONFIG
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'] ?? getenv('MAIL_HOST');
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USER'] ?? getenv('MAIL_USER');
        $mail->Password = $_ENV['MAIL_PASS'] ?? getenv('MAIL_PASS');
        $mail->SMTPSecure = (($_ENV['MAIL_SECURE'] ?? getenv('MAIL_SECURE')) === 'tls') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = (int) ($_ENV['MAIL_PORT'] ?? getenv('MAIL_PORT'));
        $mail->CharSet = 'UTF-8';

        // HEADERS
        $mail->setFrom($_ENV['MAIL_FROM'] ?? getenv('MAIL_FROM'), $_ENV['MAIL_FROM_NAME'] ?? getenv('MAIL_FROM_NAME'));
        $mail->addAddress($_ENV['MAIL_TO'] ?? getenv('MAIL_TO'), $_ENV['MAIL_TO_NAME'] ?? getenv('MAIL_TO_NAME'));
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
    exit;
}
?>

<!DOCTYPE html>
<html lang="<?= htmlspecialchars($currentLang, ENT_QUOTES | ENT_HTML5); ?>"
    dir="<?= htmlspecialchars($dir, ENT_QUOTES | ENT_HTML5); ?>" data-theme="dark">

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
        $rawAction === 'server/contact/form.php' ||
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