<?php
require_once './app/PHPdotenv/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

require './app/PHPMailer/src/PHPMailer.php';
require './app/PHPMailer/src/SMTP.php';
require './app/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
        $mail->Host = 'smtp.sandokan.cat';
        $mail->SMTPAuth = true;
        $mail->Username = 'dev@sandokan.cat';
        $mail->Password = getenv('MAIL_PASS');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        // HEADERS
        $mail->setFrom('dev@sandokan.cat', 'Gonzalo Cabezas Núñez');
        $mail->addAddress($email);
        $mail->addReplyTo('dev@sandokan.cat');

        // BODY
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "
            <p>Nombre: <strong>$name</strong></p>
            <p>Email: <strong>$email</strong></p>
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
