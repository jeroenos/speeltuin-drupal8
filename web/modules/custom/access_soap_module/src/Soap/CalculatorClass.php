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

}
