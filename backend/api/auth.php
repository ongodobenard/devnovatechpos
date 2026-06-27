<?php
require_once '../config/config.php';
require_once 'middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method === 'POST') login($conn);
        break;
    case 'logout':
        logout();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function login($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password required']);
        return;
    }

    $stmt = $conn->prepare("SELECT u.*, b.name as business_name, b.business_type 
                        FROM users u 
                        LEFT JOIN businesses b ON u.business_id = b.id 
                        WHERE u.email = ? AND (u.is_active = 1 OR u.is_active IS NULL)");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        return;
    }

    $token = bin2hex(random_bytes(32));

    $stmt2 = $conn->prepare("INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR)) ON DUPLICATE KEY UPDATE token=VALUES(token), expires_at=VALUES(expires_at)");
    $stmt2->bind_param('is', $user['id'], $token);
    $stmt2->execute();

    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id'            => $user['id'],
            'name'          => $user['name'],
            'email'         => $user['email'],
            'role'          => $user['role'],
            'business_id'   => $user['business_id'],
            'business_name' => $user['business_name'] ?? '',
            'business_type' => $user['business_type'] ?? '',
            'is_active'     => $user['is_active'],
        ]
    ]);
}

function logout() {
    echo json_encode(['success' => true, 'message' => 'Logged out']);
}