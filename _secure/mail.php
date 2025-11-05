<?php
$mensaje = [
    "cuerpo" =>
        '<html>
            <head>
                <meta charset="utf-8">
                <title>Comunicado de inicio curso</title>
            </head>
            <body>
                <p>HOLA</p>
            </body>
        </html>',
    "asunto" => "ASUNTO DEL CORREO"
];

// Configuración de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
		
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.tuservidor.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'tucorreo@tuservidor.com';
    $mail->Password = 'contraseña';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587; // Pon el que tengas
	//Codificacion
	$mail->CharSet = 'UTF-8';
    // Encabezados
    $mail->setFrom('tucorreo@tuservidor.com', 'El nombre que quieres que vean');
    $mail->addAddress($correo);
    $mail->addReplyTo('corresRespuesta@tuservidor.com');

    // Contenido		
    $mail->isHTML(true);
    $mail->Subject = $mensaje["asunto"];   
    $mail->Body = $mensaje["cuerpo"];
    $mail->AltBody = strip_tags($mensaje["cuerpo"]);

    if ($mail->send()) {
        echo json_encode(['resultado' => 'OK']);
    } else {
        echo json_encode(['resultado' => 'Error', 'error' => 'Error al enviar el correo: ' . $mail->ErrorInfo]);
    }
} catch (Exception $e) {
    echo json_encode(['resultado' => 'Error', 'error' => 'Excepción: ' . $e->getMessage()]);
}
?>


<?php
require '../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $mail->isSMTP();
    $mail->Host = 'smtp.sandokan.cat';
    $mail->SMTPAuth = true;
    $mail->Username = 'dev@sandokan.cat';
    $mail->Password = '';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 578;

    $mail->setFrom('dev@sandokan.cat', 'Gonzalo Cabezas Núñez');
    $mail->addAddress('dev@sandokan.cat', 'Gonzalo Cabezas Núñez');

    $mail->Subject = 'Nuevo mensaje de ' . $name;
    $mail->Body = "Has recibido un nuevo mensaje de contacto.\n\n".
                  "Nombre: $name\n".
                  "Correo: $email\n".
                  "Mensaje: $message";
    $mail->AltBody = "Has recibido un nuevo mensaje de contacto.\n\n".
                     "Nombre: $name\n".
                     "Correo: $email\n".
                     "Mensaje: $message";

    if ($mail->send()) {
        echo 'El correo ha sido enviado exitosamente.';
    } else {
        echo 'Error al enviar el correo: ' . $mail->ErrorInfo;
    }
}
?>

