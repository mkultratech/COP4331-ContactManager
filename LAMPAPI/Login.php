<?php
	ini_set('display_errors', 1);
    error_reporting(E_ALL);

	$inData = getRequestInfo();
	$username = trim($inData['username'] ?? '');
	$password = trim($inData['password'] ?? '');
	
	// 2. Validate input
	if ($username === '' || $password === '')
	{
		http_response_code(400);
		echo json_encode(["id" => 0, "firstName" => "", "lastName" => "", "error" => "Missing username and/or password!"]);
		exit;
	}

	// 3. Connect to MySQL
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		http_response_code(500);
		echo json_encode(["id" => 0, "firstName" => "", "lastName" => "", "error" => "Failed to Connect to Database."]);
		exit;
	}

	// 4. Prepare statement used to fetch user corresponding with given username
	$stmt = $conn->prepare('SELECT ID, FirstName, LastName, Password FROM Users WHERE Username = ? ');
	$stmt->bind_param('s', $username);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc())
	{
		// 5. Verify password against the stored hash
		if (password_verify($password, $row['Password'])) {
			http_response_code(200);
			echo json_encode(["id" => $row['ID'], "firstName"=>$row['FirstName'], "lastName"=>$row['LastName'], "error"=>""]);
		} 
		else 
		{
			http_response_code(401);
			echo json_encode(["id" => 0, "firstName" => "", "lastName" => "", "error" => "Invalid Password"]);
		}
	} 
	
	else 
	{
		// No such username
		http_response_code(404);
		echo json_encode(["id" => 0, "firstName" => "", "lastName" => "", "error" => "User Not Found"]);
	}

	// Clean up
	$stmt->close();
	$conn->close();
	
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// function sendResultInfoAsJson( $obj )
	// {
	// 	header('Content-type: application/json');
	// 	echo $obj;
	// }
	
	// function returnWithError( $err )
	// {
	// 	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	// 	sendResultInfoAsJson( $retValue );
	// }
	
	// function returnWithInfo( $firstName, $lastName, $id )
	// {
	// 	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	// 	sendResultInfoAsJson( $retValue );
	// }
	
?>
