<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    header('Content-Type: application/json');

    // 1. Read & Decode JSON input
    $inData     = json_decode(file_get_contents('php://input'), true);
    $firstName  = trim($inData['firstName'] ?? '');
    $lastName   = trim($inData['lastName']  ?? '');
    $username   = trim($inData['username']  ?? '');
    $email      = trim($inData['email']     ?? '');
    $password   = $inData['password']       ?? '';

    // 2. Basic validation of required input fields
    if ($firstName === '' || $lastName === '' || $username === '' || $email === '' || $password === '')
    {
        http_response_code(400);
        echo json_encode(['id' => 0, 'error' => 'Missing required fields*']);
        exit;
    }

	// Email format check
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) 
	{
		http_response_code(400);
		echo json_encode(['id' => 0, 'error' => 'Invalid email address']);
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

    // 4. Check if entered username and/or email already exists
    $stmt = $conn->prepare('SELECT Username, Email FROM Users WHERE Username = ? OR Email = ?');
    $stmt->bind_param('ss', $username, $email);
    $stmt->execute();
	$result = $stmt->get_result();

	$usernameTaken = false;
	$emailTaken = false;

	// Scan returned rows for any matches
	while ($row = $result->fetch_assoc())
	{
		if ($row['Username'] === $username)
			$usernameTaken = true;

		if ($row['Email'] === $email)
			$emailTaken = true;
	}

	if ($usernameTaken || $emailTaken)
	{
		http_response_code(409);

		if ($usernameTaken && $emailTaken)
			$msg = 'An account with that Username and Email already exists';

		else if ($usernameTaken)
			$msg = 'An account with that Username already exists';
		else
			$msg = 'An account with that Email already exists';

		echo json_encode(['id' => 0, 'error' => $msg]);
		exit;
	}
	
	$stmt->close();

    
    // 5. Hash the password
    $phash = password_hash($password, PASSWORD_DEFAULT);

    // 6. Insert new user
    $stmt = $conn->prepare('INSERT INTO Users (FirstName, LastName, Username, Email, Password) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssss', $firstName, $lastName, $username, $email, $phash);

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