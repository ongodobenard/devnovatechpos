<?php
require_once '../config/config.php';
require_once 'middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') list_users($conn);
        break;
    case 'create':
        if ($method === 'POST') create_user($conn);
        break;
    case 'update':
        if ($method === 'PUT') update_user($conn);
        break;
    case 'delete':
        if ($method === 'DELETE') delete_user($conn);
        break;
    case 'me':
        if ($method === 'GET') get_me($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function list_users($conn) {
    $user = require_role('super_admin', 'admin');
    $business_id = $_GET['business_id'] ?? $user['business_id'];

    if ($user['role'] === 'admin') {
        $business_id = $user['business_id'];
    }

    $stmt = $conn->prepare("SELECT id, name, email, role, business_id, is_active, created_at 
                            FROM users WHERE business_id = ? ORDER BY created_at DESC");
    $stmt->bind_param('i', $business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $result]);
}

function create_user($conn) {
    $user = require_role('super_admin', 'admin');
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email and password are required']);
        return;
    }

    // Admin can only create cashiers
    if ($user['role'] === 'admin' && ($data['role'] ?? 'cashier') !== 'cashier') {
        http_response_code(403);
        echo json_encode(['error' => 'Admins can only create cashiers']);
        return;
    }

    $hashed      = password_hash($data['password'], PASSWORD_BCRYPT);
    $business_id = $user['role'] === 'admin' ? $user['business_id'] : ($data['business_id'] ?? null);
    $role        = $data['role'] ?? 'cashier';
    $name        = $data['name'];
    $email       = $data['email'];

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, business_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('ssssi',
        $name,
        $email,
        $hashed,
        $role,
        $business_id
    );
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

function update_user($conn) {
    $user = require_role('super_admin', 'admin');
    $data = json_decode(file_get_contents('php://input'), true);

    $name      = $data['name'];
    $email     = $data['email'];
    $is_active = $data['is_active'] ?? 1;
    $id        = $data['id'];

    $stmt = $conn->prepare("UPDATE users SET name=?, email=?, is_active=? WHERE id=?");
    $stmt->bind_param('ssii',
        $name,
        $email,
        $is_active,
        $id
    );
    $stmt->execute();
    echo json_encode(['success' => true]);
}

function delete_user($conn) {
    $user = require_role('super_admin', 'admin');
    $id = $_GET['id'] ?? 0;
    $stmt = $conn->prepare("UPDATE users SET is_active = 0 WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

function get_me($conn) {
    $user = authenticate();
    $stmt = $conn->prepare("SELECT u.id, u.name, u.email, u.role, u.business_id, 
                            b.name as business_name, b.business_type
                            FROM users u
                            LEFT JOIN businesses b ON u.business_id = b.id
                            WHERE u.id = ?");
    $stmt->bind_param('i', $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $result]);
}