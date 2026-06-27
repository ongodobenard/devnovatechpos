<?php
// Set headers for a proper JSON API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Useful if your frontend is on port 5173
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/config.php';

// Handle preflight OPTIONS request for CORS if needed
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') list_expenses($conn);
        break;
    case 'create':
        if ($method === 'POST') create_expense($conn);
        break;
    case 'update':
        if ($method === 'PUT') update_expense($conn);
        break;
    case 'delete':
        if ($method === 'DELETE') delete_expense($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function list_expenses($conn) {
    $business_id = (int)($_GET['business_id'] ?? 0);
    $month       = $_GET['month'] ?? date('Y-m');

    // Wrapped `date` in backticks to prevent MySQL parser syntax confusion
    $stmt = $conn->prepare("SELECT *, `date` FROM expenses 
                            WHERE business_id = ? 
                            AND DATE_FORMAT(`date`, '%Y-%m') = ?
                            ORDER BY `date` DESC");
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        return;
    }

    $stmt->bind_param('is', $business_id, $month);
    $stmt->execute();
    $expenses = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $expenses]);
}

function create_expense($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $business_id    = (int)($data['business_id'] ?? 0);
    $category       = $data['category'] ?? '';
    $description    = $data['description'] ?? '';
    $amount         = (float)($data['amount'] ?? 0);
    $expense_date   = $data['date'] ?? date('Y-m-d');
    $payment_method = $data['payment_method'] ?? 'cash';

    $stmt = $conn->prepare("INSERT INTO expenses 
        (business_id, category, description, amount, `date`, payment_method) 
        VALUES (?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        return;
    }

    $stmt->bind_param('issdss',
        $business_id,
        $category,
        $description,
        $amount,
        $expense_date,
        $payment_method
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
}

function update_expense($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $category       = $data['category'] ?? '';
    $description    = $data['description'] ?? '';
    $amount         = (float)($data['amount'] ?? 0);
    $expense_date   = $data['date'] ?? date('Y-m-d');
    $payment_method = $data['payment_method'] ?? 'cash';
    $id             = (int)($data['id'] ?? 0);
    $business_id    = (int)($data['business_id'] ?? 0);

    $stmt = $conn->prepare("UPDATE expenses SET 
        category=?, description=?, amount=?, `date`=?, payment_method=? 
        WHERE id=? AND business_id=?");
        
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        return;
    }

    $stmt->bind_param('ssdssii',
        $category,
        $description,
        $amount,
        $expense_date,
        $payment_method,
        $id,
        $business_id
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
}

function delete_expense($conn) {
    $id = (int)($_GET['id'] ?? 0);
    $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ?");
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        return;
    }

    $stmt->bind_param('i', $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}