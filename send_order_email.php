<?php
header('Content-Type: application/json');

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Include PHPMailer
require 'C:/xampp/htdocs/priyanka/PHPMailer-master/src/Exception.php';
require 'C:/xampp/htdocs/priyanka/PHPMailer-master/src/PHPMailer.php';
require 'C:/xampp/htdocs/priyanka/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Get the form data
$transaction_id = $_POST['transaction_id'] ?? '';
$payment_method = $_POST['payment_method'] ?? 'online';
$order_details = json_decode($_POST['order_details'], true);

// Validate required fields
if (empty($order_details['customer']) || empty($order_details['order'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
    exit;
}

// Extract data
$customer = $order_details['customer'];
$order = $order_details['order'];

// Handle file upload for online payments
$payment_proof_path = '';
if ($payment_method === 'online' && !empty($_FILES['payment_proof'])) {
    $upload_dir = 'payment_proofs/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $file_name = uniqid() . '_' . basename($_FILES['payment_proof']['name']);
    $target_file = $upload_dir . $file_name;
    
    if (move_uploaded_file($_FILES['payment_proof']['tmp_name'], $target_file)) {
        $payment_proof_path = $target_file;
    }
}

// Email configuration
$admin_email = 'priyanka.jijausoftwares@gmail.com';
$subject = 'Order Confirmation - Amrut Honey';
$order_id = 'AMRUT-' . uniqid();
$subject_admin = 'New Order Received - ' . $order_id;

// Prepare payment details section based on payment method
if ($payment_method === 'online') {
    $payment_details = "
    <div class='payment-details'>
        <h3>Payment Details</h3>
        <p><strong>Payment Method:</strong> Online Payment (UPI)</p>
        <p><strong>Transaction ID:</strong> $transaction_id</p>
        <p><strong>Payment Amount:</strong> {$order['total']}</p>
    </div>";
    
    $admin_payment_details = "
    <div class='payment-details'>
        <h3>Payment Details</h3>
        <p><strong>Payment Method:</strong> Online Payment (UPI)</p>
        <p><strong>Transaction ID:</strong> $transaction_id</p>
        <p><strong>Payment Amount:</strong> {$order['total']}</p>
        <p><strong>Payment Date:</strong> " . date('Y-m-d H:i:s') . "</p>
    </div>";
} else {
    $payment_details = "
    <div class='payment-details'>
        <h3>Payment Details</h3>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        <p><strong>Amount to Collect:</strong> {$order['total']}</p>
    </div>";
    
    $admin_payment_details = "
    <div class='payment-details'>
        <h3>Payment Details</h3>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        <p><strong>Amount to Collect:</strong> {$order['total']}</p>
    </div>";
}

// Prepare email content for customer
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
        .payment-details { background-color: #fff8e1; padding: 15px; margin: 15px 0; border-radius: 5px; }
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
                    $productName = htmlspecialchars($item['name'] ?? 'Product');
                    $size = htmlspecialchars($item['size'] ?? '');
                    $quantity = htmlspecialchars($item['quantity'] ?? 1);
                    $price = number_format(($item['price'] ?? 0) * $quantity, 2);
                    
                    $customer_message .= "
                    <tr>
                        <td>{$productName}" . ($size ? " ({$size})" : "") . "</td>
                        <td>{$quantity}</td>
                        <td>₹{$price}</td>
                    </tr>";
                }
                
           $customer_message .= "
                <tr><td colspan='2'><strong>Subtotal</strong></td><td>{$order['subtotal']}</td></tr>
                <tr><td colspan='2'><strong>Shipping</strong></td><td>{$order['shipping']}</td></tr>
                <tr><td colspan='2'><strong>Tax</strong></td><td>{$order['tax']}</td></tr>
                <tr><td colspan='2'><strong>Total</strong></td><td>{$order['total']}</td></tr>
            </table>
            
            {$payment_details}
            
            <h3>Shipping Information</h3>
            <p>
                {$customer['firstName']} {$customer['lastName']}<br>
                {$customer['address']}<br>
                {$customer['city']}, {$customer['state']} {$customer['zip']}<br>
                Phone: {$customer['phone']}
            </p>
            
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
        .payment-details { background-color: #fff8e1; padding: 15px; margin: 15px 0; border-radius: 5px; }
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
                    $productName = htmlspecialchars($item['name'] ?? 'Product');
                    $size = htmlspecialchars($item['size'] ?? '');
                    $quantity = htmlspecialchars($item['quantity'] ?? 1);
                    $price = number_format(($item['price'] ?? 0) * $quantity, 2);
                    
                    $admin_message .= "
                    <tr>
                        <td>{$productName}" . ($size ? " ({$size})" : "") . "</td>
                        <td>{$quantity}</td>
                        <td>₹{$price}</td>
                    </tr>";
                }
                
    $admin_message .= "
                <tr><td colspan='2'><strong>Subtotal</strong></td><td>{$order['subtotal']}</td></tr>
                <tr><td colspan='2'><strong>Shipping</strong></td><td>{$order['shipping']}</td></tr>
                <tr><td colspan='2'><strong>Tax</strong></td><td>{$order['tax']}</td></tr>
                <tr><td colspan='2'><strong>Total</strong></td><td>{$order['total']}</td></tr>
            </table>
            
            {$admin_payment_details}
            
            <p><strong>Shipping Method:</strong> " . ucfirst(str_replace('-', ' ', $order['shippingMethod'])) . "</p>
            
            <p>Please process this order promptly.</p>
        </div>
    </div>
</body>
</html>
";

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ps662001@gmail.com';
    $mail->Password   = 'npcqieiamcjwavfp';
    $mail->SMTPSecure = "tls";
    $mail->Port       = 587;

    // Enable debugging
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
    
    // Attach payment proof if available
    if ($payment_proof_path) {
        $mail->addAttachment($payment_proof_path);
    }
    
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Emails sent successfully']);
    
} catch (Exception $e) {
    $error = "Mailer Error: " . $e->getMessage() . "\n";
    $error .= "PHPMailer Debug: " . $mail->ErrorInfo;
    file_put_contents('php://stderr', $error);
    echo json_encode(['success' => false, 'message' => $error]);
}
?>