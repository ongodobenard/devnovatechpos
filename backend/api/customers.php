<?php
require_once '../config/config.php';
require_once 'middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') list_customers($conn);
        break;
    case 'create':
        if ($method === 'POST') create_customer($conn);
        break;
    case 'delete':
        if ($method === 'DELETE') delete_customer($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function list_customers($conn) {
    $user = require_role('super_admin', 'admin', 'cashier');
    $business_id = $_GET['business_id'] ?? $user['business_id'];

    $stmt = $conn->prepare("SELECT * FROM customers WHERE business_id = ? ORDER BY name ASC");
    $stmt->bind_param('i', $business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $result]);
}

function create_customer($conn) {
    $user = require_role('super_admin', 'admin');
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Customer name is required']);
        return;
    }

    $business_id = $user['role'] === 'admin' ? $user['business_id'] : ($data['business_id'] ?? null);
    $name  = $data['name'];
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';

    $stmt = $conn->prepare("INSERT INTO customers (business_id, name, email, phone) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('isss', $business_id, $name, $email, $phone);
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

function delete_customer($conn) {
    $user = require_role('super_admin', 'admin');
    $id = $_GET['id'] ?? 0;
    $stmt = $conn->prepare("DELETE FROM customers WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}