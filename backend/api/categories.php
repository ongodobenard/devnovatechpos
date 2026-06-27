<?php
require_once '../config/config.php';
require_once 'middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':   if ($method === 'GET')    list_cats($conn);   break;
    case 'create': if ($method === 'POST')   create_cat($conn);  break;
    case 'delete': if ($method === 'DELETE') delete_cat($conn);  break;
    default: echo json_encode(['error' => 'Invalid action']);
}

function list_cats($conn) {
    $user        = authenticate();
    $business_id = $_GET['business_id'] ?? $user['business_id'];
    $stmt = $conn->prepare("SELECT * FROM categories WHERE business_id = ? ORDER BY name ASC");
    $stmt->bind_param('i', $business_id);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $rows]);
}

function create_cat($conn) {
    $user = require_role('admin', 'super_admin');
    $data = json_decode(file_get_contents('php://input'), true);
    $name        = trim($data['name']        ?? '');
    $business_id = $data['business_id']      ?? $user['business_id'];
    if (!$name) { http_response_code(400); echo json_encode(['error' => 'Name required']); return; }
    $stmt = $conn->prepare("INSERT INTO categories (name, business_id) VALUES (?, ?)");
    $stmt->bind_param('si', $name, $business_id);
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

function delete_cat($conn) {
    $user = require_role('admin', 'super_admin');
    $id   = $_GET['id'] ?? 0;
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}