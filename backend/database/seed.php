<?php
require_once '../config/config.php';

$name = 'Super Admin';
$email = 'admin@devnovatechpos.com';
$password = password_hash('Admin@2026', PASSWORD_BCRYPT);
$role = 'super_admin';

$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, business_id) VALUES (?, ?, ?, ?, NULL)");
$stmt->bind_param('ssss', $name, $email, $password, $role);

if ($stmt->execute()) {
    echo "Super admin created!";
} else {
    echo "Error: " . $conn->error;
}
$conn->close();