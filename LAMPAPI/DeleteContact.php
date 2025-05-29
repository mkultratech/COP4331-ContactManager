<?php

        header('Content-Type: application/json');

        ini_set('display_errors', 1);
        error_reporting(E_ALL);

        // 1. Read & decode JSON input
        $inData = getRequestInfo();
        $userId = isset($inData['userId']) ? intval($inData['userId']) : 0;
        $contactId = isset($inData['contactId']) ? intval($inData['contactId']) : 0;

        // 2. Validate required fields for deleting a contact
        if ($userId <= 0 || $contactId <= 0)
        {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Missing or invalid userId/contactId']);
                exit;
        }

        // 3. Connect to MySQL
        $conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');
        if ($conn->connect_error)
        {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
                exit;
        }

        // 4. Prepare DELETE statement and bind
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");

        if (!$stmt)
        {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Prepare failed: ' . $conn->error]);
                $conn->close();
                exit;
        }

        $stmt->bind_param('ii', $contactId, $userId);

        // 5. Execute and check result
        if (!$stmt->execute())
        {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Execute failed: ' . $stmt->error]);
                $stmt->close();
                $conn->close();
                exit;
        }

        // 6. Check affected rows
        if ($stmt->affected_rows > 0)
        {
                http_response_code(200);
                echo json_encode(['success' => true, 'error' => '']);
        }

        else
        {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Contact not found']);
        }

        // 7. CLean up
        $stmt->close();
        $conn->close();

        function getRequestInfo()
        {
            return json_decode(file_get_contents("php://input"), true);
        }
?>