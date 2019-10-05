<?php

namespace Drupal\jeroens_soap_webservice\Soap\Types;

/**
 * Object Type.
 */
class ObjectType {
  /**
   * Handelsnaam.
   *
   * @var string
   */
  public $handelsnaam;

  /**
   * KvKNummer.
   *
   * @var string
   */
  public $kvknummer;

  /**
   * Vestigingsnummer.
   *
   * @var string
   */
  public $vestigingsnummer;

  /**
   * Adres.
   *
   * @var AdresType
   */
  public $adres;

  /**
   * Locatie.
   *
   * @var LocatieType
   */
  public $locatie;

}
