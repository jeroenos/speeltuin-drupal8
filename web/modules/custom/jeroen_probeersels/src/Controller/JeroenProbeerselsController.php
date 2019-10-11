<?php

namespace Drupal\jeroen_probeersels\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class JeroenProbeerselsController.
 *
 * Generate a Metatag tag plugin.
 *
 * @package  \Drupal\jeroen_probeersels\Controller
 */
class JeroenProbeerselsController extends ControllerBase {

  public function sayhello() {

    return ["#markup" => t("Hello there too.")];
  }

  public function getusers() {

    # Voorbeeld statische query
    #    
    $query = \Drupal::database()->select('users_field_data', 'ufd')
      ->fields('ufd', ['name', 'mail'])
      ->condition('ufd.uid', 1, '<>');

    $result = $query->execute()->fetchAll();

    foreach ($result as $record) {
      $return = $return . $record->name . '<BR>' . $record->mail . '<BR>' . '<BR>';
    }
    return ["#markup" => $return];
  }

}
