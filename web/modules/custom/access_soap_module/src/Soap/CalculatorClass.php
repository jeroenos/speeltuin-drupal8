<?php

namespace Drupal\access_soap_module\Soap;

class CalculatorClass {

  public function add($data) {
    $response = new \stdClass;
    $response->AddResult = $data->intA + $data->intB;
    return $response;
  }

  public function subtract($data) {
    $response = new \stdClass;
    $response->SubtractResult = $data->intA - $data->intB;
    return $response;
  }

  public function divide($data) {
    $response = new \stdClass;
    $response->DivideResult = $data->intA / $data->intB;
    return $response;
  }

  public function multiply($data) {
    $response = new \stdClass;
    $response->MultiplyResult = $data->intA * $data->intB;
    return $response;
  }

  public function random() {
    $response = new \stdClass;
    $response->RandomResult = rand();
    return $response;
  }

  public function square($data) {
    
    $result=$data->intA; 
    $ArrayOfSquareResultType = array();
   
    // Build up an array with SquareResultTypes
    for ($i = 1; $i <=10 ; $i++) {
       $result = $result * $data->intA;          
       $SquareResultType = new \stdClass;
       $SquareResultType->SquareResult = $result;
       $ArrayOfSquareResultType[] = $SquareResultType;
    }
    
    // Assign the array with the results to the response type
    $response = new \stdClass;
    $response->ListOfSquares = $ArrayOfSquareResultType;
    
    return $response;
  }

}
