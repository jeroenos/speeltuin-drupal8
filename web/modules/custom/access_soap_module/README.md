# Access soap module for Drupal
With this module you can setup a soap websevice for your Drupal site.
You can use it as a kickstart for your own specific service.

I set it up as a calculator as an example. 
The wsdl markup is in access_soap_module/templates/calculator_service.html.twig and the implementations off the operations are in access_soap_module/src/Soap/CalculatorClass.php
You can write you own twig template and class with your own busisness logic the same way.

## Installation
This module requires composer for installation. To install, simply run ``composer require drupal/access_soap_module``.

## Quickstart
After installation http://<your domain>>/services/access_soap_module/soap/endpoint?wsdl to render the wsdl.

If you are using Firefox or Chromium you van install the Wizdler plugin to test the service. 

## Documentation

[Documentation](doc/SUMMARY.md)  The following blog post was the inspiration and basic for the module:

* [https://www.weareaccess.co.uk/blog/2018/02/creating-soap-server-drupal-8](https://www.weareaccess.co.uk/blog/2018/02/creating-soap-server-drupal-8)

## Resources


## Related projects


