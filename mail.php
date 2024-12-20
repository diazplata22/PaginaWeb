<?php

	$myAwardSpaceEmail	= "alfasafe.com"; //Servidor gratuito
	$myPersonalEmail	= "Servicioalcliente@alfatrafing.com.co";      // mi correo

	if(isset($_POST['submit'])) {
		//$subject = $_POST['subject'];
		$subject = "Formulario de contacto alfasafe.com {$_POST['name']}";
		//$password = $_POST['password'];
		$name = $_POST['name'];
		$email = $_POST['email'];
		$phone = $_POST['phone'];
		$message = "Nombre: {$_POST['name']} Correo Electronico: {$_POST['email']} Telefono: {$_POST['phone']} \n
		{$_POST['message']} ";
		$headers = "MIME-Version: 1.0 \r\n";
		$headers.= "Contect-type: text/html;
		charset=uft-8 \r\n";
		$headers.= "From: Formulario de contacto <" . $myAwardSpaceEmail . ">" . "\r\n";
		$headers.= "Reply-To: " . $name . "<" . $email . ">" . "\r\n";

		echo "Tu mensaje ha sido enviado correctamente!";
		$rta = mail($myPersonalEmail, $subject, $message, $headers); // NO TOCAR
		
		echo "Tu mensaje ha sido enviado correctamente! $rta";
	} else {
		echo "Ha ocurrido un error.";
	}
?>