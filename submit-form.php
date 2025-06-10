<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $subject = strip_tags(trim($_POST["subject"]));
    $message = strip_tags(trim($_POST["message"]));
    
    // Set recipient email (replace with your email)
    $to = "ps662001@gmail.com";
    
    // Set email subject
    $email_subject = "New Contact Form Submission: $subject";
    
    // Build email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Message:\n$message\n";
    
    // Build email headers
    $headers = "From: $name <$email>";
    
    // Send email
    if (mail($to, $email_subject, $email_content, $headers)) {
        // Success - redirect to thank you page
        header("Location: thank-you.html");
        exit;
    } else {
        // Error - redirect to error page
        header("Location: error.html");
        exit;
    }
} else {
    // Not a POST request, redirect to contact page
    header("Location: contact.html");
    exit;
}
?>