<?php

include 'config/db.php';

$name = $_POST['customer_name'];
$balance = $_POST['balance'];

$sql = "INSERT INTO accounts(customer_name, balance)
        VALUES('$name', '$balance')";

if(mysqli_query($conn, $sql)) {

    header("Location: index.php");

} else {

    echo "Error creating account";

}

?>
