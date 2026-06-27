<?php
require_once '../config/config.php';
require_once 'middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') list_businesses($conn);
        break;
    case 'create':
        if ($method === 'POST') create_business($conn);
        break;
    case 'update':
        if ($method === 'PUT') update_business($conn);
        break;
    case 'delete':
        if ($method === 'DELETE') delete_business($conn);
        break;
    case 'single':
        if ($method === 'GET') get_business($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function list_businesses($conn) {
    $user = require_role('super_admin');
    $stmt = $conn->prepare("SELECT b.*, u.name as owner_name, u.email as owner_email 
                            FROM businesses b 
                            LEFT JOIN users u ON b.owner_id = u.id 
                            ORDER BY b.created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $result]);
}

function create_business($conn) {
    $user = require_role('super_admin');
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name']) || empty($data['business_type'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Business name and type are required']);
        return;
    }

    if (empty($data['admin_name']) || empty($data['admin_email']) || empty($data['admin_password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Admin name, email and password are required']);
        return;
    }

    // Check duplicate admin email
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param('s', $data['admin_email']);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Admin email already exists']);
        return;
    }

    // Assign all values to variables first — bind_param requires references
    $name       = $data['name'];
    $type       = $data['business_type'];
    $phone      = $data['phone'] ?? null;
    $email      = $data['email'] ?? null;
    $address    = $data['address'] ?? null;
    $plan       = $data['subscription_plan'] ?? 'basic';
    $expires    = !empty($data['subscription_expires_at']) ? $data['subscription_expires_at'] : null;
    $admin_name = $data['admin_name'];
    $admin_email= $data['admin_email'];
    $admin_pass = $data['admin_password'];

    $conn->begin_transaction();

    try {
        // Step 1 — Insert business
        $stmt = $conn->prepare("
            INSERT INTO businesses 
            (name, business_type, phone, email, address, subscription_plan, subscription_expires_at, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        ");
        $stmt->bind_param('sssssss', $name, $type, $phone, $email, $address, $plan, $expires);
        $stmt->execute();
        $business_id = $conn->insert_id;

        // Step 2 — Insert admin user
        $hashed = password_hash($admin_pass, PASSWORD_BCRYPT);
        $role   = 'admin';

        $stmt2 = $conn->prepare("
            INSERT INTO users (name, email, password, role, business_id, is_active) 
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        $stmt2->bind_param('ssssi', $admin_name, $admin_email, $hashed, $role, $business_id);
        $stmt2->execute();
        $owner_id = $conn->insert_id;

        // Step 3 — Link owner to business
        $stmt3 = $conn->prepare("UPDATE businesses SET owner_id = ? WHERE id = ?");
        $stmt3->bind_param('ii', $owner_id, $business_id);
        $stmt3->execute();

        $conn->commit();

        echo json_encode([
            'success'     => true,
            'business_id' => $business_id,
            'owner_id'    => $owner_id,
            'message'     => 'Business and admin created successfully'
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
function update_business($conn) {
    $user = require_role('super_admin', 'admin');
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $conn->prepare("UPDATE businesses SET 
        name=?, phone=?, email=?, address=?, subscription_plan=?, 
        subscription_expires_at=?, is_active=? 
        WHERE id=?");
    $stmt->bind_param('ssssssii',
        $data['name'],
        $data['phone'] ?? null,
        $data['email'] ?? null,
        $data['address'] ?? null,
        $data['subscription_plan'] ?? 'basic',
        $data['subscription_expires_at'] ?? null,
        $data['is_active'] ?? 1,
        $data['id']
    );
    $stmt->execute();
    echo json_encode(['success' => true]);
}

function delete_business($conn) {
    $user = require_role('super_admin');
    $id = $_GET['id'] ?? 0;
    $stmt = $conn->prepare("UPDATE businesses SET is_active = 0 WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

function get_business($conn) {
    $user = authenticate();
    $id = $_GET['id'] ?? 0;
    $stmt = $conn->prepare("SELECT b.*, u.name as owner_name, u.email as owner_email 
                            FROM businesses b 
                            LEFT JOIN users u ON b.owner_id = u.id 
                            WHERE b.id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $result]);
}