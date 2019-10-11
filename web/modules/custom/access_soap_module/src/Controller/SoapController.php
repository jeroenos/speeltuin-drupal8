<?php

namespace Drupal\access_soap_module\Controller;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Controller\ControllerBase;

class SoapController extends ControllerBase {

  /**
   * Request var.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  public $request;

  /**
   * SoapController constructor.
   *
   * @param \Symfony\Component\HttpFoundation\RequestStack $request
   *   Request stack.
   */
  public function __construct(RequestStack $request) {
    $this->request = $request;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('request_stack')
    );
  }

  /**
   * Soap method.
   *
   * @param string $endpoint
   *   Endpoint url as a string.
   *
   * @return bool|Response
   *   A response object or FALSE on failure.
   */
  public function soap($endpoint) {
    // Get the Symfony request component so that we can adapt the page request
    // accordingly.
    $request = $this->request->getCurrentRequest();

    // Respond appropriately to the different HTTP verbs.
    switch ($request->getMethod()) {
      case 'GET':
        // This is a get request, so we handle it by returning a WSDL file.
        $wsdlFileRender = $this->handleGetRequest($endpoint, $request);

        if ($wsdlFileRender == FALSE) {
          // If the WSDL file was not returned then we issue a 404.
          throw new NotFoundHttpException();
        }

        // Render the WSDL file.
        $wsdlFileOutput = \Drupal::service('renderer')->render($wsdlFileRender);

        // Return the WSDL file as output.
        $response = new Response($wsdlFileOutput);
        $response->headers->set('Content-type', 'application/xml; charset=utf-8');
        return $response;

      case 'POST':
        // Handle SOAP Request.
        $result = $this->handleSoapRequest($endpoint, $request);

        if ($result == FALSE) {
          // False should only be returned via a non-existent endpoint,
          // so we return a 404.
          throw new NotFoundHttpException();
        }

        // Return the response from the SOAP request.
        $response = new Response($result);
        $response->headers->set('Content-type', 'application/xml; charset=utf-8');
        return $response;

      default:
        // Not a GET or a POST request, return a 404.
        throw new NotFoundHttpException();
    }
  }

  /**
   * Handle GET request.
   *
   * @param string $endpoint
   *   Name of the endpoint.
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Request object.
   *
   * @return array
   *   Render array.
   */
  public function handleGetRequest($endpoint, Request $request) {
    $baseUrl = \Drupal::request()->getSchemeAndHttpHost();
    return [
      '#theme' => 'calculator_service',
      '#xsd_url' => NULL,
      '#service_endpoint' => $baseUrl . '/services/access_soap_module/soap/' . $endpoint ,
    ];
  }

  public function handleSoapRequest($endpoint, $request) {
    // Construct the WSDL file location.
    $wsdlUri = \Drupal::request()->getSchemeAndHttpHost() . '/services/access_soap_module/soap/' . $endpoint . '?wsdl=true';
    $soapClass = 'Drupal\access_soap_module\Soap\CalculatorClass';
    
    try {
      // Create some options for the SoapServer.
      $serverOptions = [
        'encoding' => 'UTF-8',
        'wsdl_cache_enabled' => 1,
        'wsdl_cache' => WSDL_CACHE_DISK,
        'wsdl_cache_ttl' => 604800,
        'wsdl_cache_limit' => 10,
        'send_errors' => TRUE,
      //  'classmap' => $classmap,
      ];

      // Instantiate the SoapServer.
      $soapServer = new \SoapServer($wsdlUri, $serverOptions);
      $soapServer->setClass($soapClass);

      // Turn output buffering on.
      ob_start();
      // Handle the SOAP request.
      $soapServer->handle();
      // Get the buffers contents.
      $result = ob_get_contents();
      // Removes topmost output buffer.
      ob_end_clean();
      // Send back the result.
      return $result;
    }
    catch (\Exception $e) {
      // An error happened so we log it.
      \Drupal::logger('access_soap_module')->error('soap error ' . $e->getMessage());
      // Then return a SoapFault object as the result.
      $soap_fault = new \SoapFault($e->getMessage(), $e->getCode(), NULL, $e->getErrorDetail());
      return $soap_fault;
    }
  }

}
