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

  public function statusrapportage($data) {

    $arrayOftellingType = array();
    
    for ($i = 1; $i <= 3; $i++) {
      $telling = new TellingType(); 
      $telling->batchId = $i;
      $telling->sector = 'HORECA';
      $telling->programma = 'Veilig eten en drinken';
      $telling->status = 0;
      $telling->aantal = $i * $i;
      $arrayOftellingType [] = $telling;
    }

     $response = new DrupalStatusrapportage();
  //   $response = new \stdClass;
     $response->ListOfTellingen;
     $response->ListOfTellingen = $arrayOftellingType;
    return $response;
  }

}
