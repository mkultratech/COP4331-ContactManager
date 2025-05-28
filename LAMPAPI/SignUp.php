<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    header('Content-Type: application/json');

    // 1. Read & Decode JSON input
    $inData = json_decode(file_get_contents('php://input'), true);
    $firstName  = trim($inData['firstName'] ?? '');
    $lastName   = trim($inData['lastName']  ?? '');
    $login      = trim($inData['login']     ?? '');
    $password   = $inData['password'] ?? '';

    // 2. Basic validation of required input fields
    if ($firstName === '' || $lastName === '' || $login === '' || $password === '')
    {
        http_response_code(400);
        echo json_encode(['id' => 0, 'error' => 'Missing required fields*']);
        exit;
    }

    // 3. Connect to MySQL
    $conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');
    if ($conn->connect_error)
    {
        http_response_code(500);
        echo json_encode(['id' => 0, 'error' => 'Failed to Connect to Database']);
        exit;
    }

    // 4. Check if entered login info already exists
    $stmt = $conn->prepare('SELECT 1 FROM Users WHERE Login = ?');
    $stmt->bind_param('s', $login);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0)
    {
        http_response_code(409);
        echo json_encode(['id' => 0, 'error' => 'Username already exists.']);
        $stmt->close();
        $conn->close();
        exit();
    }

    // 5. Hash the password
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // 6. Insert new user
    $stmt = $conn->prepare(
        'INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)'
    );

    $stmt->bind_param('ssss', $firstName, $lastName, $login, $hash);
    if ($stmt->execute())
    {
        $newId = $stmt->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $newId, 'error' => '']);
    }

    else
    {
        http_response_code(500);
        echo json_encode(['id' => 0, 'error' => 'Failed to create new user.']);
    }

    $stmt->close();
    $conn->close();

?>