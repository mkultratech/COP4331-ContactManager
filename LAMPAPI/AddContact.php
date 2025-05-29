<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    
    header('Content-Type: application/json');

    $inData = getRequestInfo();
    $firstName = trim($inData["firstName"] ?? '');
    $lastName = trim($inData["lastName"] ?? '');
    $phone = trim($inData["phone"] ?? '');
    $email = trim($inData["email"] ?? '');
    $userId = isset($inData["userId"]) ? intval($inData["userId"]) : 0;

    // 2. Validate required fields
    if ($firstName === '' || $lastName === '' || $phone === '' || $email === '' || $userId <= 0) 
    {
        http_response_code(400);
        echo json_encode(['contactId' => 0, 'error' => 'Missing or invalid fields']);
        exit;
    }

    // 3. Connect to MySQL
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        http_response_code(500);
        echo json_encode(['contactId' => 0, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }



    
    // TODO: CHECK IF CONTACT ALREADY EXISTS




    // 4. Prepare and execute INSERT
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
    //$stmt->execute();
    
    if (!$stmt->execute()) 
    {
        // INSERT failed
        http_response_code(500);
        echo json_encode(['contactId' => 0,'error' => 'Execute failed: ' . $stmt->error]);
        $stmt->close();
        $conn->close();
        exit;
    }

    // 5. Success!
    $newId = $stmt->insert_id;
    http_response_code(201);
    echo json_encode(['contactId' => $newId, 'error' => '']);

    // 5. Clean up
    $stmt->close();
    $conn->close();


    function getRequestInfo() 
    {
        return json_decode(file_get_contents("php://input"), true);
    }

?>
