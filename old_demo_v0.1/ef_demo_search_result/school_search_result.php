<?php

  $now_file = $_POST['filename'];
  
  if($now_file == 1){
        $json_file_str = file_get_contents('school_result_json_data1.json');	  
  }elseif($now_file == 2){
	    $json_file_str = file_get_contents('school_result_json_data2.json');
  }else{
	  $json_file_str = file_get_contents('school_result_json_data3.json');
  }
	  
	  
	  echo $json_file_str;
	  exit;
?>