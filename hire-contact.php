<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
?>
<?php
// Show errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Database connection
$dbHost = "localhost";
$dbUser = "zohair";
$dbPass = "zohairkhan123";
$dbName = "portfolio_contacts";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed: " . $conn->connect_error]);
    exit;
}

// Get POST data (from form)
$fullName   = $_POST['fullName']   ?? '';
$email      = $_POST['email']      ?? '';
$phone      = $_POST['phone']      ?? '';
$company    = $_POST['company']    ?? '';
$projectTitle = $_POST['projectTitle'] ?? '';
$projectType  = $_POST['projectType']  ?? '';
$projectDescription = $_POST['projectDescription'] ?? '';
$services   = isset($_POST['services']) ? (is_array($_POST['services']) ? implode(", ", $_POST['services']) : $_POST['services']) : '';
$budget     = $_POST['budget']     ?? '';
$timeline   = $_POST['timeline']   ?? '';
$additionalInfo = $_POST['additionalInfo'] ?? '';

// Save to DB
$stmt = $conn->prepare("INSERT INTO hire_requests 
(full_name, email, phone, company, project_title, project_type, project_description, services, budget, timeline, additional_info) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssssss", $fullName, $email, $phone, $company, $projectTitle, $projectType, $projectDescription, $services, $budget, $timeline, $additionalInfo);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "DB insert failed: " . $stmt->error]);
    exit;
}

// Send Email
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "zohairkhan2008@gmail.com";  // your Gmail
    $mail->Password = "gdfw qlrw odqj ncvg";       // Gmail App Password
    $mail->SMTPSecure = "tls";
    $mail->Port = 587;

    $mail->setFrom("zohairkhan2008@gmail.com", "Hire Form");
    $mail->addAddress("zohairkhan2008@gmail.com");

    $mail->isHTML(true);
    $mail->Subject = "New Hire Form Submission";
    $mail->Body = "
        <h2>New Project Request</h2>
        <p><strong>Name:</strong> {$fullName}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Company:</strong> {$company}</p>
        <p><strong>Project Title:</strong> {$projectTitle}</p>
        <p><strong>Project Type:</strong> {$projectType}</p>
        <p><strong>Description:</strong> {$projectDescription}</p>
        <p><strong>Services:</strong> {$services}</p>
        <p><strong>Budget:</strong> {$budget}</p>
        <p><strong>Timeline:</strong> {$timeline}</p>
        <p><strong>Additional Info:</strong> {$additionalInfo}</p>
    ";

    $mail->send();
    echo json_encode(["status" => "success", "message" => "Form saved & email sent!"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Email failed: " . $mail->ErrorInfo]);
}

$conn->close();
