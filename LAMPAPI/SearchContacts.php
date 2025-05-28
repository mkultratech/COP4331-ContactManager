<?php

    header('Content-Type: application/json');

    $inData = getRequestInfo();
    $userId = isset($inData['userId']) ? intval($inData['userId']) : 0;
    $searchTerm = isset($inData['searchTerm']) ? trim($inData['searchTerm']) : '';

    // 2. Validate required field
    if ($userId<= 0)
    {
        http_response_code(400);
        echo json_encode(['results' => [], 'error' => 'Missing or invalid userId']);
        exit;
    }

    // 3. Connect to MySQL
    $conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');
    if ($conn->connect_error)
    {
        http_response_code(500);
        echo json_encode(['results' => [], 'error' => 'Database connection failed']);
        exit;
    }

    if ($searchTerm !== '')
    {
        // Search with wildcard
        $like = "%{$searchTerm}%";
        $sql = "SELECT ID, FirstName, LastName, Phone, Email
                FROM Contacts WHERE UserID = ?
                AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
                ORDER by LastName, FirstName";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('issss', $userId, $like, $like, $like, $like);
    }
    
    else
    {
        $sql = "SELECT ID, FirstName, LastName, Phone, Email
                FROM Contacts
                WHERE UserID = ?
                ORDER BY LastName, FirstName";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $userId);
    }

    // 5. Execute & fetch
    $stmt->execute();
    $result = $stmt->get_result();

    $contacts = [];
    while ($row = $result->fetch_assoc())
    {
        $contacts[] = [
            'id' => (int)$row['ID'],
            'firstName' => $row['FirstName'],
            'lastName' => $row['LastName'],
            'phone' => $row['Phone'],
            'email' => $row['Email']
        ];
    }

    // 6. Return JSON response
    http_response_code(200);
    echo json_encode(['results' => $contacts, 'error' => '']);

    // 7. Clean up!
    $stmt->close();
    $conn->close();


    function getRequestInfo() 
    {
        return json_decode(file_get_contents("php://input"), true);
    }

?>