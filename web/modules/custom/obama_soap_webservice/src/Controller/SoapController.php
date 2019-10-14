<?php

namespace Drupal\obama_soap_webservice\Controller;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\Core\Controller\ControllerBase;

/**
 * Dump HTTP Request To File.
 */
class DumpHTTPRequestToFile {

  /**
   * Log HTTP request tot $targetFile.
   *
   * @param string $targetFile
   *   Target file name.
   */
  public function execute($targetFile) {
    $data = sprintf(
      "%s %s %s\n\nHTTP headers:\n",
      $_SERVER['REQUEST_METHOD'],
      $_SERVER['REQUEST_URI'],
      $_SERVER['SERVER_PROTOCOL']
    );
    foreach ($this->getHeaderList() as $name => $value) {
      $data .= $name . ': ' . $value . "\n";
    }
    $data .= "\nRequest body:\n";
    file_put_contents(
      $targetFile,
      $data . file_get_contents('php://input') . "\n",
      FILE_APPEND
    );
  }

  /**
   * Get header list.
   *
   * @return string[]
   *   List of headers.
   */
  private function getHeaderList() {
    $headerList = [];
    foreach ($_SERVER as $name => $value) {
      if (preg_match('/^HTTP_/', $name)) {
        // Convert HTTP_HEADER_NAME to Header-Name.
        $name = strtr(substr($name, 5), '_', ' ');
        $name = ucwords(strtolower($name));
        $name = strtr($name, ' ', '-');
        // Add to list.
        $headerList[$name] = $value;
      }
    }
    return $headerList;
  }

}

/**
 * Obama Soap Webservice Controller.
 */
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
        (new DumpHTTPRequestToFile)->execute('/tmp/postdata.log');
        // Handle SOAP Request.
        $result = $this->handleSoapRequest($endpoint, $request);

        if ($result === FALSE) {
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
      '#theme' => 'publicatie_service',
      '#xsd_url' => $baseUrl . '/' . drupal_get_path('module', 'obama_soap_webservice') . '/xsd/obaDrupal.xsd',
      '#service_endpoint' => $baseUrl . '/services/obama_soap_webservice/soap/' . $endpoint,
    ];
  }

  /**
   * Handle SOAP request.
   *
   * @param string $endpoint
   *   Name of the endpoint.
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Request object.
   *
   * @return string
   *   Result of the SOAP call.
   */
  public function handleSoapRequest($endpoint, Request $request) {
    // Construct the WSDL file location.
    $wsdlUri = \Drupal::request()
      ->getSchemeAndHttpHost() . '/services/obama_soap_webservice/soap/' . $endpoint . '/?wsdl=true';
    $soapClass = 'Drupal\obama_soap_webservice\Soap\PublicatieServiceClass';

    $classmap = [
      'drupalPublicatie' => 'Drupal\obama_soap_webservice\Soap\Types\DrupalPublicatie',
      'headerType' => 'Drupal\obama_soap_webservice\Soap\Types\HeaderType',
      'adresType' => 'Drupal\obama_soap_webservice\Soap\Types\AdresType',
      'domeinType' => 'Drupal\obama_soap_webservice\Soap\Types\DomeinType',
      'locatieType' => 'Drupal\obama_soap_webservice\Soap\Types\LocatieType',
      'maatregelenType' => 'Drupal\obama_soap_webservice\Soap\Types\MaatregelenType',
      'maatregelType' => 'Drupal\obama_soap_webservice\Soap\Types\MaatregelType',
      'objectType' => 'Drupal\obama_soap_webservice\Soap\Types\ObjectType',
      'onderwerpOordeelType' => 'Drupal\obama_soap_webservice\Soap\Types\OnderwerpOordeelType',
      'oordeelType' => 'Drupal\obama_soap_webservice\Soap\Types\OordeelType',
      'oordelenType' => 'Drupal\obama_soap_webservice\Soap\Types\OordelenType',
      'overtredingType' => 'Drupal\obama_soap_webservice\Soap\Types\OvertredingType',
      'publicatieType' => 'Drupal\obama_soap_webservice\Soap\Types\PublicatieType',
      'publicatiesType' => 'Drupal\obama_soap_webservice\Soap\Types\PublicatiesType',
    ];

    try {
      // Create some options for the SoapServer.
      $serverOptions = [
        'encoding' => 'UTF-8',
        'wsdl_cache_enabled' => 0,
        'wsdl_cache' => WSDL_CACHE_NONE,
        'wsdl_cache_ttl' => 604800,
        'wsdl_cache_limit' => 10,
        'send_errors' => TRUE,
        'classmap' => $classmap,
        'features' => SOAP_SINGLE_ELEMENT_ARRAYS,
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
      \Drupal::logger('obama_soap_webservice')
        ->error('soap error ' . $e->getMessage());
      // Then return a SoapFault object as the result.
      $soap_fault = new \SoapFault($e->getMessage(), $e->getCode(), NULL, $e->getErrorDetail());
      return $soap_fault;
    }
  }

}
