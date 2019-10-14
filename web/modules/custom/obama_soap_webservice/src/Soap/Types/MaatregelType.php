<?php

namespace Drupal\obama_soap_webservice\Soap\Types;

/**
 * Maatregel Type.
 */
class MaatregelType {
  /**
   * Datum.
   *
   * @var Date
   */
  public $datum;

  /**
   * Status.
   *
   * @var string
   */
  public $status;

  /**
   * Soort.
   *
   * @var string
   */
  public $soort;

  /**
   * Beslissing.
   *
   * @var string
   */
  public $beslissing;

  /**
   * Motivering.
   *
   * @var string[]
   */
  public $motivering;

  /**
   * Reactie.
   *
   * @var string[]
   */
  public $reactie;

  /**
   * Bedrag.
   *
   * @var float
   */
  public $bedrag;

  /**
   * Overtredingen.
   *
   * @var OvertredingType[]
   */
  public $overtredingen;

}
