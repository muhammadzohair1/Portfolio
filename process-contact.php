<?php
header('Content-Type: application/json');

// Enable error logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/contact_errors.log');

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$response = ['success' => false, 'message' => ''];

try {
    // Database connection - using your credentials from screenshot
    $conn = new mysqli("localhost", "zohair", "zohairkhan123", "portfolio_contacts");
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Validate required fields
    $required = ['name', 'email', 'phone', 'age', 'message'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Please fill in the {$field} field");
        }
    }

    // Sanitize inputs
    $name = $conn->real_escape_string(trim($_POST['name']));
    $email = $conn->real_escape_string(trim($_POST['email']));
    $phone = preg_replace('/[^0-9]/', '', trim($_POST['phone']));
    $age = intval($_POST['age']);
    $message = $conn->real_escape_string(trim($_POST['message']));

    // Validate formats
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }
    if (strlen($phone) !== 11) {
        throw new Exception("Phone number must be 11 digits");
    }

    // Save to database - matching your table structure
    $sql = "INSERT INTO contact_submissions (full_name, email, phone, age, message, created_at) 
            VALUES ('$name', '$email', '$phone', $age, '$message', NOW())";

    if (!$conn->query($sql)) {
        throw new Exception("Database Error: " . $conn->error);
    }

    // Send email
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'zohairkhan2008@gmail.com';
    $mail->Password = 'llcv dmqu bhqe byhr'; // Your App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('zohairkhan2008@gmail.com', 'Portfolio Contact');
    $mail->addAddress('zohairkhan2008@gmail.com');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = "New Contact from $name";
    $mail->Body = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Age:</strong> $age</p>
        <p><strong>Message:</strong><br>" . nl2br($message) . "</p>
    ";

    $mail->send();

    $response = [
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.'
    ];

    $conn->close();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    error_log("Error: " . $e->getMessage());
}

echo json_encode($response);
