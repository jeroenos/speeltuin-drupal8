<?php
namespace Drupal\access_soap_module\Soap;
 
class MySoapClass {
 
  public function __call($method_name, array $args) {
    try {
      switch ($method_name) {
        case 'mysoapmethod':
          return $this->mySoapMethod(array_pop($arg));
          break;
      }
 
    }
    catch (\Exception $e) {
      // Something went wrong, so return a SoapFault.
      return new \SoapFault(0, $e->getMessage(), NULL);
    }
  }
 
  public function mySoapMethod($args) {
    $response = [];
 
    // Do something.
 
    return $response;
  }
}