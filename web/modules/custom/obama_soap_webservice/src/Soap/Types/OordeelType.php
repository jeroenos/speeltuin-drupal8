<?php

namespace Drupal\obama_soap_webservice\Soap\Types;

/**
 * Oordeel Type.
 */
class OordeelType {

  /**
   * Domein.
   *
   * @var string
   */
  public $domein;

  /**
   * Oordeel.
   *
   * @var string
   */
  public $oordeel;

  /**
   * Omschrijving.
   *
   * @var string[]
   */
  public $omschrijving;

  /**
   * Datum ontstaan.
   *
   * @var Date
   */
  public $datumontstaan;

  /**
   * Reactie.
   *
   * @var string[]
   */
  public $reactie;

  /**
   * BatchID.
   *
   * @var int
   */
  public $batchId;

  /**
   * VolgNr.
   *
   * @var int
   */
  public $volgNr;

  /**
   * Onderwerp oordelen.
   *
   * @var OnderwerpOordeelType[]
   */
  public $onderwerpoordelen;

  /**
   * Formuleoordeel.
   *
   * @var string
   */
  public $formuleoordeel;

  /**
   * Formulenaam.
   *
   * @var string
   */
  public $formulenaam;

}
