<?php
function get_token() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (strpos($auth, 'Bearer ') === 0) {
        return substr($auth, 7);
    }
    return null;
}

function authenticate() {
    global $conn;
    $token = get_token();

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized — please login']);
        exit();
    }

    $stmt = $conn->prepare("SELECT u.*, b.name as business_name, b.business_type 
                            FROM auth_tokens t
                            JOIN users u ON t.user_id = u.id
                            LEFT JOIN businesses b ON u.business_id = b.id
                            WHERE t.token = ? AND t.expires_at > NOW()");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Session expired — please login again']);
        exit();
    }

    return [
        'user_id'       => $user['id'],
        'role'          => $user['role'],
        'business_id'   => $user['business_id'],
        'business_name' => $user['business_name'] ?? '',
        'business_type' => $user['business_type'] ?? '',
    ];
}

function require_role(...$roles) {
    $user = authenticate();
    if (!in_array($user['role'], $roles)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden — insufficient permissions']);
        exit();
    }
    return $user;
}

function require_same_business($business_id) {
    $user = authenticate();
    if ($user['role'] !== 'super_admin' && $user['business_id'] != $business_id) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden — wrong business']);
        exit();
    }
    return $user;
}