<?php
require_once '../config/config.php';
require_once 'middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'dashboard_stats': if ($method === 'GET') dashboard_stats($conn); break;
    case 'full_report':     if ($method === 'GET') full_report($conn);     break;
    case 'sales_summary':   if ($method === 'GET') sales_summary($conn);   break;
    case 'top_products':    if ($method === 'GET') top_products($conn);     break;
    case 'stock_value':     if ($method === 'GET') stock_value($conn);      break;
    default: echo json_encode(['error' => 'Invalid action']);
}

function dashboard_stats($conn) {
    $user        = authenticate();
    $business_id = $_GET['business_id'] ?? $user['business_id'];
    $today       = date('Y-m-d');

    // Today's sales
    $s1 = $conn->prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(total_amount),0) as rev FROM sales WHERE business_id=? AND DATE(created_at)=? AND (is_returned IS NULL OR is_returned=0)");
    $s1->bind_param('is', $business_id, $today);
    $s1->execute();
    $today_data = $s1->get_result()->fetch_assoc();

    // Total products
    $s2 = $conn->prepare("SELECT COUNT(*) as cnt FROM products WHERE business_id=? AND (is_active IS NULL OR is_active=1)");
    $s2->bind_param('i', $business_id);
    $s2->execute();
    $prods = $s2->get_result()->fetch_assoc();

    // Total customers
    $s3 = $conn->prepare("SELECT COUNT(*) as cnt FROM customers WHERE business_id=?");
    $s3->bind_param('i', $business_id);
    $s3->execute();
    $custs = $s3->get_result()->fetch_assoc();

    echo json_encode(['success' => true, 'data' => [
        'today_sales'     => $today_data['cnt'],
        'today_revenue'   => $today_data['rev'],
        'total_products'  => $prods['cnt'],
        'total_customers' => $custs['cnt'],
    ]]);
}

function full_report($conn) {
    $user        = authenticate();
    $business_id = $_GET['business_id'] ?? $user['business_id'];
    $from        = $_GET['from']   ?? date('Y-m-01');
    $to          = $_GET['to']     ?? date('Y-m-d');
    $period      = $_GET['period'] ?? 'custom';

    // Adjust dates based on period
    $today = date('Y-m-d');
    if ($period === 'today')   { $from = $today; $to = $today; }
    if ($period === 'week')    { $from = date('Y-m-d', strtotime('monday this week')); $to = $today; }
    if ($period === 'month')   { $from = date('Y-m-01'); $to = $today; }
    if ($period === 'year')    { $from = date('Y-01-01'); $to = $today; }

    // Main sales summary
    $s1 = $conn->prepare("
        SELECT 
            COUNT(*) as total_transactions,
            COALESCE(SUM(total_amount),0) as total_revenue,
            COALESCE(SUM(tax),0) as total_tax,
            COALESCE(SUM(discount),0) as total_discount,
            COALESCE(AVG(total_amount),0) as avg_sale
        FROM sales
        WHERE business_id=? 
          AND DATE(created_at) BETWEEN ? AND ?
          AND (is_returned IS NULL OR is_returned=0)
    ");
    $s1->bind_param('iss', $business_id, $from, $to);
    $s1->execute();
    $summary = $s1->get_result()->fetch_assoc();

    // Cost of goods sold (COGS) for this period — uses current buying_price
    // on each product. Note: if buying_price changes over time, this reflects
    // *current* cost, not the historical cost at the moment of each sale.
    $s7 = $conn->prepare("
        SELECT COALESCE(SUM(si.quantity * p.buying_price), 0) as total_cogs
        FROM sale_items si
        JOIN sales s ON si.sale_id = s.id
        JOIN products p ON si.product_id = p.id
        WHERE s.business_id=? 
          AND DATE(s.created_at) BETWEEN ? AND ?
          AND (s.is_returned IS NULL OR s.is_returned=0)
    ");
    $s7->bind_param('iss', $business_id, $from, $to);
    $s7->execute();
    $cogs_data  = $s7->get_result()->fetch_assoc();
    $total_cogs = floatval($cogs_data['total_cogs']);

    // Revenue by payment method
    $s2 = $conn->prepare("
        SELECT payment_method, COALESCE(SUM(total_amount),0) as total
        FROM sales
        WHERE business_id=? 
          AND DATE(created_at) BETWEEN ? AND ?
          AND (is_returned IS NULL OR is_returned=0)
        GROUP BY payment_method
    ");
    $s2->bind_param('iss', $business_id, $from, $to);
    $s2->execute();
    $by_method_rows = $s2->get_result()->fetch_all(MYSQLI_ASSOC);
    $by_payment_method = [];
    foreach ($by_method_rows as $r) {
        $by_payment_method[$r['payment_method']] = floatval($r['total']);
    }

    // Top products
    $s3 = $conn->prepare("
        SELECT si.product_name, SUM(si.quantity) as total_qty, SUM(si.subtotal) as total_revenue
        FROM sale_items si
        JOIN sales s ON si.sale_id = s.id
        WHERE s.business_id=? 
          AND DATE(s.created_at) BETWEEN ? AND ?
          AND (s.is_returned IS NULL OR s.is_returned=0)
        GROUP BY si.product_name
        ORDER BY total_qty DESC
        LIMIT 10
    ");
    $s3->bind_param('iss', $business_id, $from, $to);
    $s3->execute();
    $top_products = $s3->get_result()->fetch_all(MYSQLI_ASSOC);

    // Daily breakdown for chart
    $s4 = $conn->prepare("
        SELECT DATE(created_at) as sale_date, 
               COUNT(*) as txn_count,
               COALESCE(SUM(total_amount),0) as daily_revenue
        FROM sales
        WHERE business_id=? 
          AND DATE(created_at) BETWEEN ? AND ?
          AND (is_returned IS NULL OR is_returned=0)
        GROUP BY DATE(created_at)
        ORDER BY sale_date ASC
    ");
    $s4->bind_param('iss', $business_id, $from, $to);
    $s4->execute();
    $daily_breakdown = $s4->get_result()->fetch_all(MYSQLI_ASSOC);

    // Expenses in this period
    $s5 = $conn->prepare("
        SELECT COALESCE(SUM(amount),0) as total_expenses, COUNT(*) as exp_count
        FROM expenses
        WHERE business_id=? AND date BETWEEN ? AND ?
    ");
    $s5->bind_param('iss', $business_id, $from, $to);
    $s5->execute();
    $exp_data = $s5->get_result()->fetch_assoc();

    // Expenses by category
    $s6 = $conn->prepare("
        SELECT category, COALESCE(SUM(amount),0) as total
        FROM expenses
        WHERE business_id=? AND date BETWEEN ? AND ?
        GROUP BY category
        ORDER BY total DESC
    ");
    $s6->bind_param('iss', $business_id, $from, $to);
    $s6->execute();
    $exp_by_cat = $s6->get_result()->fetch_all(MYSQLI_ASSOC);

    $total_revenue  = floatval($summary['total_revenue']);
    $total_tax      = floatval($summary['total_tax']);
    $total_expenses = floatval($exp_data['total_expenses']);

    // Revenue excluding VAT collected (VAT isn't your money — it's the
    // government's, just passed through you).
    $net_revenue  = $total_revenue - $total_tax;

    // Gross profit = revenue (excl. VAT) minus what you paid for the goods sold.
    $gross_profit = $net_revenue - $total_cogs;

    // Net profit = gross profit minus operating expenses (rent, salaries, etc).
    $net_profit   = $gross_profit - $total_expenses;

    echo json_encode(['success' => true, 'data' => [
        'period'              => $period,
        'from'                => $from,
        'to'                  => $to,
        'total_transactions'  => intval($summary['total_transactions']),
        'total_revenue'       => $total_revenue,
        'total_tax'           => $total_tax,
        'total_discount'      => floatval($summary['total_discount']),
        'avg_sale'            => floatval($summary['avg_sale']),
        'total_cogs'          => $total_cogs,
        'gross_profit'        => $gross_profit,
        'net_profit'          => $net_profit,
        'total_expenses'      => $total_expenses,
        'exp_count'           => intval($exp_data['exp_count']),
        'by_payment_method'   => $by_payment_method,
        'top_products'        => $top_products,
        'daily_breakdown'     => $daily_breakdown,
        'expenses_by_category'=> $exp_by_cat,
    ]]);
}

function sales_summary($conn) {
    full_report($conn);
}

function top_products($conn) {
    $user        = authenticate();
    $business_id = $_GET['business_id'] ?? $user['business_id'];
    $from        = $_GET['from'] ?? date('Y-m-01');
    $to          = $_GET['to']   ?? date('Y-m-d');
    $stmt = $conn->prepare("
        SELECT si.product_name, SUM(si.quantity) as total_qty, SUM(si.subtotal) as total_revenue
        FROM sale_items si
        JOIN sales s ON si.sale_id = s.id
        WHERE s.business_id=? 
          AND DATE(s.created_at) BETWEEN ? AND ?
          AND (s.is_returned IS NULL OR s.is_returned=0)
        GROUP BY si.product_name ORDER BY total_qty DESC LIMIT 10
    ");
    $stmt->bind_param('iss', $business_id, $from, $to);
    $stmt->execute();
    echo json_encode(['success' => true, 'data' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
}

function stock_value($conn) {
    $user        = authenticate();
    $business_id = $_GET['business_id'] ?? $user['business_id'];
    $stmt = $conn->prepare("SELECT SUM(buying_price * stock_quantity) as total FROM products WHERE business_id=?");
    $stmt->bind_param('i', $business_id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    echo json_encode(['success' => true, 'data' => ['stock_value' => floatval($row['total'])]]);
}