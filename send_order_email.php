<?php
header('Content-Type: application/json');

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Include PHPMailer - adjust these paths as needed
require 'C:/xampp/htdocs/priyanka/PHPMailer-master/src/Exception.php';
require 'C:/xampp/htdocs/priyanka/PHPMailer-master/src/PHPMailer.php';
require 'C:/xampp/htdocs/priyanka/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (empty($data['customer']) || empty($data['order'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
    exit;
}

// Extract data
$customer = $data['customer'];
$order = $data['order'];

// Email configuration
$admin_email = 'priyanka.jijausoftwares@gmail.com';
$subject = 'Order Confirmation - Amrut Honey';
$order_id = 'AMRUT-' . uniqid();
$subject_admin = 'New Order Received - ' . $order_id;

// Prepare email content for customer (same as before)
$customer_message = "
<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation - Amrut Honey</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #E8A75D; color: white; padding: 15px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 10px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Thank You For Your Order!</h1>
            <p>Order #$order_id</p>
        </div>
        <div class='content'>
            <p>Dear {$customer['firstName']},</p>
            <p>Your order has been received and is being processed. Here are your order details:</p>
            
            <h3>Order Summary</h3>
            <table>
                <tr><th>Product</th><th>Quantity</th><th>Price</th></tr>";
                
                foreach ($order['items'] as $item) {
                    $customer_message .= "
                    <tr>
                        <td>{$item['name']} ({$item['size']})</td>
                        <td>{$item['quantity']}</td>
                        <td>₹" . number_format($item['price'] * $item['quantity'], 2) . "</td>
                    </tr>";
                }
                
           $customer_message .= "
                <tr><td colspan='2'><strong>Subtotal</strong></td><td>{$order['subtotal']}</td></tr>
                <tr><td colspan='2'><strong>Shipping</strong></td><td>{$order['shipping']}</td></tr>
                <tr><td colspan='2'><strong>Tax</strong></td><td>{$order['tax']}</td></tr>
                <tr><td colspan='2'><strong>Total</strong></td><td>{$order['total']}</td></tr>
            </table>
            
            <h3>Shipping Information</h3>
            <p>
                {$customer['firstName']} {$customer['lastName']}<br>
                {$customer['address']}<br>
                {$customer['city']}, {$customer['state']} {$customer['zip']}<br>
                Phone: {$customer['phone']}
            </p>
            
            <p>Payment Method: " . ucfirst(str_replace('-', ' ', $order['paymentMethod'])) . "</p>
            <p>Shipping Method: " . ucfirst(str_replace('-', ' ', $order['shippingMethod'])) . "</p>
            
            <p>If you have any questions about your order, please contact us at info@amruthoney.com.</p>
            <p>Thank you for shopping with Amrut Honey!</p>
        </div>
        <div class='footer'>
            <p>&copy; " . date('Y') . " Amrut Honey. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Prepare email content for admin
$admin_message = "
<!DOCTYPE html>
<html>
<head>
    <title>New Order - $order_id</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8B5A2B; color: white; padding: 15px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>New Order Received</h1>
            <p>Order #$order_id</p>
        </div>
        <div class='content'>
            <h3>Customer Information</h3>
            <p>
                {$customer['firstName']} {$customer['lastName']}<br>
                {$customer['email']}<br>
                Phone: {$customer['phone']}<br>
                Address: {$customer['address']}, {$customer['city']}, {$customer['state']} {$customer['zip']}
            </p>
            
            <h3>Order Details</h3>
            <table>
                <tr><th>Product</th><th>Quantity</th><th>Price</th></tr>";
                
                foreach ($order['items'] as $item) {
                    $admin_message .= "
                    <tr>
                        <td>{$item['name']} ({$item['size']})</td>
                        <td>{$item['quantity']}</td>
                        <td>₹" . number_format($item['price'] * $item['quantity'], 2) . "</td>
                    </tr>";
                }
                
$admin_message .= "
                <tr><td colspan='2'><strong>Subtotal</strong></td><td>{$order['subtotal']}</td></tr>
                <tr><td colspan='2'><strong>Shipping</strong></td><td>{$order['shipping']}</td></tr>
                <tr><td colspan='2'><strong>Tax</strong></td><td>{$order['tax']}</td></tr>
                <tr><td colspan='2'><strong>Total</strong></td><td>{$order['total']}</td></tr>
            </table>
            
            <p><strong>Payment Method:</strong> " . ucfirst(str_replace('-', ' ', $order['paymentMethod'])) . "</p>
            <p><strong>Shipping Method:</strong> " . ucfirst(str_replace('-', ' ', $order['shippingMethod'])) . "</p>
            
            <p>Please process this order promptly.</p>
        </div>
    </div>
</body>
</html>
";

$mail = new PHPMailer(true);

try {
    // Server settings - UPDATE THESE WITH YOUR SMTP CREDENTIALS
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // For Gmail
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ps662001@gmail.com'; // Your Gmail
    $mail->Password   = 'npcqieiamcjwavfp'; // Use App Password if 2FA enabled
    $mail->SMTPSecure = "tls"; // Use TLS
    $mail->Port       = 587; // For TLS

    // Enable debugging (0 = off, 1 = client messages, 2 = client and server messages)
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {
        file_put_contents('php://stderr', "$level: $str\n");
    };

    // First email to customer
    $mail->setFrom('no-reply@amruthoney.com', 'Amrut Honey');
    $mail->addAddress($customer['email']);
    $mail->addReplyTo('info@amruthoney.com', 'Information');
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $customer_message;
    
    $mail->send();
    echo "Customer email sent!\n";

    // Clear all addresses and attachments for next email
    $mail->clearAddresses();
    $mail->clearAttachments();

    // Second email to admin
    $mail->setFrom('orders@amruthoney.com', 'Amrut Honey Orders');
    $mail->addAddress($admin_email);
    $mail->addReplyTo($customer['email'], $customer['firstName'] . ' ' . $customer['lastName']);
    $mail->isHTML(true);
    $mail->Subject = $subject_admin;
    $mail->Body    = $admin_message;
    
    $mail->send();
    echo "Admin email sent!\n";

    echo json_encode(['success' => true, 'message' => 'Emails sent successfully']);
    
} catch (Exception $e) {
    $error = "Mailer Error: " . $e->getMessage() . "\n";
    $error .= "PHPMailer Debug: " . $mail->ErrorInfo;
    file_put_contents('php://stderr', $error);
    echo json_encode(['success' => false, 'message' => $error]);
}
?>