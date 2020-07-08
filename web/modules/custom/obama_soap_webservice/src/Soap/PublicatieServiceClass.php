<?php

namespace Drupal\obama_soap_webservice\Soap;

use Drupal\obama_soap_webservice\Soap\Types\DrupalPublicatie;
use Drupal\obama_soap_webservice\Soap\Types\TellingType;
use Drupal\obama_soap_webservice\Soap\Types\DrupalStatusrapportage;

/**
 * PublicatieServiceClass.
 */
class PublicatieServiceClass {

  /**
   * Bulk update.
   *
   * @param \Drupal\obama_soap_webservice\Soap\Types\DrupalPublicatie $data
   *   Lijst met openbaarmakingen.
   */
  public function publicatie(DrupalPublicatie $data) {

    // Inkomende berichten zullen over 4 verschillende queues worden verdeeld.
    $queue_nummer = 0;
    $queue_1 = \Drupal::queue('obama_runner_1');
    $queue_2 = \Drupal::queue('obama_runner_2');
    $queue_3 = \Drupal::queue('obama_runner_3');
    $queue_4 = \Drupal::queue('obama_runner_4');

    // Als dit een array is, dan zijn er meerdere "openbaarmakingen"
    // maar als er maar eentje is, is dit geen array en moet hij niet gaan
    // loopen, anders wordt ieder veld een record in de queue tabel.
    foreach ($data->drupal->publicatie as $publicatie) {

      // Skippen bij ontbreken van kvk-nummer en/of kvkvestigingsnummer.
      if ((empty($publicatie->object->kvknummer)) ||
        (empty($publicatie->object->vestigingsnummer)) ||
        (empty($publicatie->object->handelsnaam))
      ) {
        $message = 'Empty kvknummer, kvkvestigingsnummer or handelsnaam, queue item skipped';
      }
      else {
        $publicatie->oordelen->batchId = $data->header->batchId;
        $publicatie->oordelen->volgNr = $data->header->volgNr;

        $queue_nummer++;
        if ($queue_nummer == 1) {
          $queue_1->createItem($publicatie);
        }
        elseif ($queue_nummer == 2) {
          $queue_2->createItem($publicatie);
        }
        elseif ($queue_nummer == 3) {
          $queue_3->createItem($publicatie);
        }
        else {
          $queue_4->createItem($publicatie);
          $queue_nummer = 0;
        }

        $message = 'Aangeleverd '
          . $publicatie->oordelen->batchId . '/' . $publicatie->oordelen->volgNr
          . ' - ' . $publicatie->object->vestigingsnummer
          . ' - ' . $publicatie->object->kvknummer
          . ' - ' . $publicatie->object->handelsnaam

        ;
      }
      \Drupal::logger('obama_soap_webservice')->notice($message);
    }
    return 10;
  }

  /**
   * Status rapportage
   *
   * @param String $data
   */
  public function statusrapportage($data) {
    $response = new DrupalStatusrapportage();

    for ($i = 1; $i <= 3; $i++) {
      $telling = new TellingType();
      $telling->batchId = $i;
      $telling->sector = 'HORECA';
      $telling->programma = 'Veilig eten en drinken';
      $telling->status = 0;
      $telling->aantal = $i * $i;
      $response->ListOfTellingen[] = $telling;
    }
    return $response;
  }

  /**
   * Receive and queue Obama Keuren Publicaties messages operation.
   *
   * @param String $data
   *   List with Obama keuren publications.
   */
    public function publiceerkeuren($data) {

    $batch = $data->batch;
    $message = 'publiceerKeuren started - batchId=' . $batch->batchId . ' volgNr' . $batch->volgNr;
    \Drupal::logger('obama_soap_webservice')->notice($message);

    $queue = \Drupal::queue('obama_keuren_runner');
    foreach ($data->drupalKeuren->publiceerKeuren as $publiceerKeuren) {

      if ((empty($publiceerKeuren->object->kvknummer)) ||
        (empty($publiceerKeuren->object->vestigingsnummer)) ||
        (empty($publiceerKeuren->object->handelsnaam))
      ) {
        $message = 'Empty kvknummer, kvkvestigingsnummer or handelsnaam, queue item skipped';
      }
      else {
        // add info batch info to publicatie.
        $publiceerKeuren->batch = $batch;

        $queue->createItem($publiceerKeuren);

        $message = 'Aangeleverd keuren'
          . $publiceerKeuren->batch->batchId . '/' . $publiceerKeuren->batch->volgNr
          . ' - ' . $publiceerKeuren->object->vestigingsnummer
          . ' - ' . $publiceerKeuren->object->kvknummer
          . ' - ' . $publiceerKeuren->object->handelsnaam;
      }
      \Drupal::logger('obama_soap_webservice')->notice($message);
    }
    $message = 'publiceerKeuren ended.';
    \Drupal::logger('obama_soap_webservice')->notice($message);

    $response = new \stdClass();
    return $response;
  }

}
