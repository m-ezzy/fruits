<?php
	require 'server.php';

	$u = $_SESSION['user_name'];
	$gn = $_REQUEST['q'];

	$_SESSION['current']['group'] = $gn;

	//$_SESSION['row_number'] = 0;
	$row_number = 0;

	$query = "SELECT sent_by,messages FROM group_messages_$gn";
	$result = $conn->query($query);

	$rows = array();
	$rows[] = $u;

	while($r = $result->fetch_object()) {
		$rows[] = $r;
		$row_number++;
	}
	
	$json = json_encode($rows);
	echo $json;

	$_SESSION['groups'][$gn]['row_number'] = $row_number;
?>