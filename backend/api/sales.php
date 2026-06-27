<?php
require_once '../config/config.php';
require_once 'middleware.php'; 

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        if ($method === 'GET') list_sales($conn);
        break;
    case 'create':
        if ($method === 'POST') create_sale($conn);
        break;
    case 'receipt':
        if ($method === 'GET') get_receipt($conn);
        break;

        case 'list_all':
    if ($method === 'GET') list_all_sales($conn);
    break;
    case 'return':
    if ($method === 'POST') process_return($conn);
    break;
    case 'daily_summary':
        if ($method === 'GET') daily_summary($conn);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function list_sales($conn) {
    $business_id = $_GET['business_id'] ?? 0;
    $date = $_GET['date'] ?? date('Y-m-d');
    $stmt = $conn->prepare("SELECT s.*, u.name as cashier_name, c.name as customer_name 
                            FROM sales s 
                            LEFT JOIN users u ON s.cashier_id = u.id 
                            LEFT JOIN customers c ON s.customer_id = c.id 
                            WHERE s.business_id = ? AND DATE(s.created_at) = ?
                            ORDER BY s.created_at DESC");
    $stmt->bind_param('is', $business_id, $date);
    $stmt->execute();
    $result = $stmt->get_result();
    $sales = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $sales]);
}

function create_sale($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    $receipt_number = 'RCP-' . strtoupper(uniqid());

    $business_id    = $data['business_id'];
    $cashier_id     = $data['cashier_id'];
    $customer_id    = $data['customer_id'] ?? null;
    $total_amount   = $data['total_amount'];
    $discount       = $data['discount'] ?? 0;
    $tax            = $data['tax'] ?? 0;
    $amount_paid    = $data['amount_paid'];
    $change_given   = $data['change_given'] ?? 0;
    $payment_method = $data['payment_method'] ?? 'cash';

    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare("INSERT INTO sales 
            (business_id, cashier_id, customer_id, receipt_number, total_amount, discount, tax, amount_paid, change_given, payment_method) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('iiisddddds',
            $business_id,
            $cashier_id,
            $customer_id,
            $receipt_number,
            $total_amount,
            $discount,
            $tax,
            $amount_paid,
            $change_given,
            $payment_method
        );
        $stmt->execute();
        $sale_id = $conn->insert_id;

        foreach ($data['items'] as $item) {
            $product_id   = $item['product_id'];
            $product_name = $item['product_name'];
            $quantity     = $item['quantity'];
            $unit_price   = $item['unit_price'];
            $subtotal     = $item['subtotal'];

            $stmt2 = $conn->prepare("INSERT INTO sale_items 
                (sale_id, product_id, product_name, quantity, unit_price, subtotal) 
                VALUES (?, ?, ?, ?, ?, ?)");
            $stmt2->bind_param('iisidd',
                $sale_id,
                $product_id,
                $product_name,
                $quantity,
                $unit_price,
                $subtotal
            );
            $stmt2->execute();

            $stmt3 = $conn->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
            $stmt3->bind_param('ii', $quantity, $product_id);
            $stmt3->execute();
        }

        $conn->commit();
        echo json_encode(['success' => true, 'sale_id' => $sale_id, 'receipt_number' => $receipt_number]);

    } catch (\Throwable $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function get_receipt($conn) {
    $sale_id = $_GET['sale_id'] ?? 0;
    $stmt = $conn->prepare("SELECT s.*, u.name as cashier_name, c.name as customer_name 
                            FROM sales s 
                            LEFT JOIN users u ON s.cashier_id = u.id 
                            LEFT JOIN customers c ON s.customer_id = c.id 
                            WHERE s.id = ?");
    $stmt->bind_param('i', $sale_id);
    $stmt->execute();
    $sale = $stmt->get_result()->fetch_assoc();

    $stmt2 = $conn->prepare("SELECT * FROM sale_items WHERE sale_id = ?");
    $stmt2->bind_param('i', $sale_id);
    $stmt2->execute();
    $items = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);

    $sale['items'] = $items;
    echo json_encode(['success' => true, 'data' => $sale]);
}

function daily_summary($conn) {
    $business_id = $_GET['business_id'] ?? 0;
    $date = $_GET['date'] ?? date('Y-m-d');
    $stmt = $conn->prepare("SELECT 
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        SUM(discount) as total_discounts,
        payment_method,
        COUNT(*) as count
        FROM sales 
        WHERE business_id = ? AND DATE(created_at) = ? AND status = 'completed'
        GROUP BY payment_method");
    $stmt->bind_param('is', $business_id, $date);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $result]);
}

function list_all_sales($conn) {
    $user       = authenticate();
    $business_id = $user['business_id'];
    if ($user['role'] === 'super_admin') {
        $business_id = $_GET['business_id'] ?? 0;
    }
    $from = $_GET['from'] ?? '';
    $to   = $_GET['to']   ?? '';

    if ($from && $to) {
        $stmt = $conn->prepare("
            SELECT s.*, u.name as cashier_name, c.name as customer_name
            FROM sales s
            LEFT JOIN users u     ON s.cashier_id   = u.id
            LEFT JOIN customers c ON s.customer_id  = c.id
            WHERE s.business_id = ?
              AND DATE(s.created_at) BETWEEN ? AND ?
              AND (s.is_returned IS NULL OR s.is_returned = 0)
            ORDER BY s.created_at DESC
        ");
        $stmt->bind_param('iss', $business_id, $from, $to);
    } else {
        $stmt = $conn->prepare("
            SELECT s.*, u.name as cashier_name, c.name as customer_name
            FROM sales s
            LEFT JOIN users u     ON s.cashier_id  = u.id
            LEFT JOIN customers c ON s.customer_id = c.id
            WHERE s.business_id = ?
              AND (s.is_returned IS NULL OR s.is_returned = 0)
            ORDER BY s.created_at DESC
            LIMIT 200
        ");
        $stmt->bind_param('i', $business_id);
    }
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $rows]);
}

function process_return($conn) {
    $user = authenticate();
    $data = json_decode(file_get_contents('php://input'), true);

    $sale_id       = $data['sale_id']       ?? 0;
    $admin_password = $data['admin_password'] ?? '';
    $business_id   = $data['business_id']   ?? 0;

    // If cashier — verify admin password
    if ($user['role'] === 'cashier') {
        // Find the admin of this business
        $stmt = $conn->prepare("
            SELECT password FROM users
            WHERE business_id = ? AND role = 'admin' AND is_active = 1
            LIMIT 1
        ");
        $stmt->bind_param('i', $business_id);
        $stmt->execute();
        $admin = $stmt->get_result()->fetch_assoc();

        if (!$admin || !password_verify($admin_password, $admin['password'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Incorrect admin password']);
            return;
        }
    }

    // Get the sale
    $stmt = $conn->prepare("SELECT * FROM sales WHERE id = ? AND business_id = ?");
    $stmt->bind_param('ii', $sale_id, $business_id ?: $user['business_id']);
    $stmt->execute();
    $sale = $stmt->get_result()->fetch_assoc();

    if (!$sale) {
        http_response_code(404);
        echo json_encode(['error' => 'Sale not found']);
        return;
    }

    $conn->begin_transaction();
    try {
        // Restore stock for each item
        $items_stmt = $conn->prepare("SELECT * FROM sale_items WHERE sale_id = ?");
        $items_stmt->bind_param('i', $sale_id);
        $items_stmt->execute();
        $items = $items_stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        foreach ($items as $item) {
            $upd = $conn->prepare("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?");
            $upd->bind_param('ii', $item['quantity'], $item['product_id']);
            $upd->execute();
        }

        // Mark sale as returned (soft delete)
        $del = $conn->prepare("UPDATE sales SET is_returned = 1, returned_at = NOW() WHERE id = ?");
        $del->bind_param('i', $sale_id);
        $del->execute();

        $conn->commit();
        echo json_encode([
            'success'        => true,
            'message'        => 'Return processed successfully',
            'amount_returned' => $sale['total_amount'],
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}