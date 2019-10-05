<?php

namespace Drupal\jeroens_soap_webservice\Soap\Types;

/**
 * Adres Type.
 */
class AdresType {
  /**
   * Straatnaam.
   *
   * @var string[]
   */
  public $straatnaam;

  /**
   * Huisnummer.
   *
   * @var string
   */
  public $huisnummer;

  /**
   * Huisnummer toevoeging.
   *
   * @var string[]
   */
  public $huisnummertoevoeging;

  /**
   * Huisletter.
   *
   * @var string[]
   */
  public $huisletter;

  /**
   * Postcode.
   *
   * @var string
   */
  public $postcode;

  /**
   * Woonplaats naam.
   *
   * @var string[]
   */
  public $woonplaatsNaam;

}
