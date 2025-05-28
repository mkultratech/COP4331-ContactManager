<?php
    header('Content-Type: application/json');

    // 1. Decode JSON input
    $inData = getRequestInfo();
    $userId = isset($inData['userId']) ? intval($inData['userId']) : 0;

    function getRequestInfo() 
    {
        return json_decode(file_get_contents("php://input"), true);
    }
?> 