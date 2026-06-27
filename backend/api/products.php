<?php
require_once '../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') list_products($conn);
        break;
    case 'add':
        if ($method === 'POST') add_product($conn);
        break;
    case 'update':
        if ($method === 'PUT') update_product($conn);
        break;
    case 'delete':
        if ($method === 'DELETE') delete_product($conn);
        break;
    case 'low_stock':
        if ($method === 'GET') low_stock($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function list_products($conn) {
    $business_id = $_GET['business_id'] ?? 0;
    $stmt = $conn->prepare("SELECT * FROM products WHERE business_id = ? AND is_active = 1 ORDER BY name ASC");
    $stmt->bind_param('i', $business_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $products]);
}

function add_product($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $business_id    = $data['business_id'];
    $name           = $data['name'];
    $generic_name   = $data['generic_name'] ?? '';
    $category       = $data['category'] ?? '';
    $buying_price   = $data['buying_price'] ?? 0;
    $selling_price  = $data['selling_price'];
    $stock_quantity = $data['stock_quantity'] ?? 0;
    $reorder_level  = $data['reorder_level'] ?? 10;
    $unit           = $data['unit'] ?? '';
    $barcode        = $data['barcode'] ?? '';
    $expiry_date    = $data['expiry_date'] ?? null;
    if (empty($expiry_date)) { $expiry_date = null; }

    $stmt = $conn->prepare("INSERT INTO products 
        (business_id, name, generic_name, category, buying_price, selling_price, stock_quantity, reorder_level, unit, barcode, expiry_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('issssdiisss',
        $business_id,
        $name,
        $generic_name,
        $category,
        $buying_price,
        $selling_price,
        $stock_quantity,
        $reorder_level,
        $unit,
        $barcode,
        $expiry_date
    );
    $stmt->execute();
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
}

function update_product($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $name           = $data['name'];
    $generic_name   = $data['generic_name'] ?? '';
    $category       = $data['category'] ?? '';
    $buying_price   = $data['buying_price'] ?? 0;
    $selling_price  = $data['selling_price'];
    $stock_quantity = $data['stock_quantity'] ?? 0;
    $reorder_level  = $data['reorder_level'] ?? 10;
    $unit           = $data['unit'] ?? '';
    $barcode        = $data['barcode'] ?? '';
    $expiry_date    = $data['expiry_date'] ?? null;
    if (empty($expiry_date)) { $expiry_date = null; }
    $id             = $data['id'];
    $product_business_id = $data['business_id'];

    $stmt = $conn->prepare("UPDATE products SET 
        name=?, generic_name=?, category=?, buying_price=?, selling_price=?, 
        stock_quantity=?, reorder_level=?, unit=?, barcode=?, expiry_date=? 
        WHERE id=? AND business_id=?");
    $stmt->bind_param('sssddiiissii',
        $name,
        $generic_name,
        $category,
        $buying_price,
        $selling_price,
        $stock_quantity,
        $reorder_level,
        $unit,
        $barcode,
        $expiry_date,
        $id,
        $product_business_id
    );
    $stmt->execute();
    echo json_encode(['success' => true]);
}

function delete_product($conn) {
    $id = $_GET['id'] ?? 0;
    $stmt = $conn->prepare("UPDATE products SET is_active = 0 WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

function low_stock($conn) {
    $business_id = $_GET['business_id'] ?? 0;
    $stmt = $conn->prepare("SELECT * FROM products WHERE business_id = ? AND stock_quantity <= reorder_level AND is_active = 1");
    $stmt->bind_param('i', $business_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $products]);
}