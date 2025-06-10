<?php
// Headers first
header('Content-Type: application/json');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:/xampp/htdocs/amrut-honey/PHPMailer-master/src/PHPMailer.php';
require 'C:/xampp/htdocs/amrut-honey/PHPMailer-master/src/SMTP.php';
require 'C:/xampp/htdocs/amrut-honey/PHPMailer-master/src/Exception.php';
// SMTP Configuration - Use the same as in internship.php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'ps662001@gmail.com');
define('SMTP_PASS', 'npcqieiamcjwavfp'); // Use app password for Gmail
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls');
define('RECIPIENT_EMAIL', 'priyanka.jijausoftwares@gmail.com');
define('RECIPIENT_NAME', 'Jijau Software HR');

// Error handling wrapper
try {
    // Only process POST requests
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    // Include PHPMailer - adjust path as needed
    

    // Get and sanitize form data
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    // $name = htmlspecialchars($_POST['name']);
    // $email = htmlspecialchars($_POST['email']);
    // $phone = htmlspecialchars($_POST['phone']);
    // $message = htmlspecialchars($_POST['message']);

    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        throw new Exception("Name, email and message are required fields");
    }

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = 'tls';
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom($email, $name);
        $mail->addAddress(RECIPIENT_EMAIL, RECIPIENT_NAME);
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission - $name";

        // Build email body
        $emailBody = "<h2>New Contact Form Submission</h2>";
        $emailBody .= "<p><strong>Name:</strong> $name</p>";
        $emailBody .= "<p><strong>Email:</strong> <a href=\"mailto:$email\">$email</a></p>";
        $emailBody .= "<p><strong>Phone:</strong> " . ($phone ? $phone : 'Not provided') . "</p>";
        
        $emailBody .= "<h3>Message</h3>";
        $emailBody .= "<div style=\"white-space: pre-wrap;\">" . nl2br($message) . "</div>";

        $mail->Body = $emailBody;
        $mail->AltBody = strip_tags(str_replace("<br>", "\n", $emailBody));

        if ($mail->send()) {
            echo json_encode([
            'status' => 'success',
            'message' => 'Your message has been sent successfully!'
        ]);
        }else{
            echo json_encode([
                'status' => 'error',
                'message' => 'Message could not be sent. Please try again later.'
            ]);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
         throw new Exception("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

?>