<?php
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);
    session_start();
}

define('ENVIRONMENT', 'production');
define('DB_HOST', 'localhost');
define('DB_USER', 'careveek_devnovatechpos');
define('DB_PASS', 'Nozarh"98B');
define('DB_NAME', 'careveek_devnovatechpos');
define('SITE_NAME', 'DevnovaTech POS');
define('JWT_SECRET', 'devnovatechpos_secret_key_2026');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function create_db_connection(): mysqli {
    $conn = mysqli_init();
    $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 10);
    $conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Database connection failed']));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

$conn = create_db_connection();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://pos.devnovatech.co.ke');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}