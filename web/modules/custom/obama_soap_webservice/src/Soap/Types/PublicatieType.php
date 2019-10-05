<?php

namespace Drupal\obama_soap_webservice\Soap\Types;

/**
 * Drupal.
 */
class PublicatieType {

  /**
   * Object.
   *
   * @var ObjectType
   */
  public $object;

  /**
   * Oordelen.
   *
   * @var OordeelType[]
   */
  public $oordelen;

  /**
   * Maatregelen.
   *
   * @var MaatregelType[]
   */
  public $maatregelen;

  /**
   * Publicatie datum.
   *
   * @var Date
   */
  public $publicatiedatum;

}
