<?php
$inData = getRequestInfo();

$search = "%" . strtolower($inData["search"]) . "%";
$userId = $inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE UserID=? AND (LOWER(FirstName) LIKE ? OR LOWER(LastName) LIKE ?)");
    $stmt->bind_param("iss", $userId, $search, $search);
    $stmt->execute();
    $result = $stmt->get_result();

    $searchResults = "";
    while ($row = $result->fetch_assoc()) {
        if ($searchResults != "") {
            $searchResults .= ",";
        }
        $searchResults .= json_encode($row);
    }

    returnWithInfo("[" . $searchResults . "]");
    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents("php://input"), true);
}

function sendResultInfoAsJson($obj) {
    header("Content-type: application/json");
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults) {
    $retValue = '{"results":' . $searchResults . ',"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
