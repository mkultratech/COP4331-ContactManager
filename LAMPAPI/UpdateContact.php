<?php
    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    $inData = json_decode(file_get_contents("php://input"), true);

    $contactId = intval($inData["contactId"] ?? 0);
    $firstName = trim($inData["firstName"] ?? '');
    $lastName  = trim($inData["lastName"] ?? '');
    $phone     = trim($inData["phone"] ?? '');
    $email     = trim($inData["email"] ?? '');
    $userId    = intval($inData["userId"] ?? 0);

    if ($contactId <= 0 || $userId <= 0 || $firstName === '' || $lastName === '')
    {
        http_response_code(400);
        echo json_encode(["error" => "Missing or invalid fields"]);
        exit;
    }

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
    if (!$stmt)
    {
        http_response_code(500);
        echo json_encode(["error" => "Prepare failed"]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);

    if ($stmt->execute())
    {
        http_response_code(200);
        echo json_encode(["error" => ""]);
    }
    else
    {
        http_response_code(500);
        echo json_encode(["error" => "Update failed"]);
    }

    $stmt->close();
    $conn->close();
?>
