<?php

namespace Drupal\jeroen_probeersels\Plugin\QueueWorker;

use Drupal\Core\Queue\QueueWorkerBase;
use Drupal\node\Entity\Node;

/**
 * Processes .
 *
 * @QueueWorker(
 *   id = "jeroenos_runner",
 *   title = @Translation("Jeroenos Task Worker: Bulk Update"),
 *   cron = {"time" = 300}
 * )
 */
class BulkUpdateProcessor extends QueueWorkerBase {

  /**
   * {@inheritdoc}
   */
  public function processItem($data) {

    $nid = $data;
    $opmerking = "Hallo wereld vanuit de code.";

    $node = Node::load($nid);
    if ($node) {
      $node->set('body', $opmerking);
      $node->save();
      $message = $node->get('title')->value . " " . $nid . " is updated.";
    }
    else {
      $message = "Node with nid " . $nid . " doesn't exist in Visit.";
    }
    $this->set_as_verwerkt($nid);
     
    \Drupal::logger('jeroen_probeersels')->info(t($message));
  }

 protected function set_as_verwerkt($nid) {
    
     \Drupal::database()->update('jeroen_probeersels_nodes')
      ->condition('nid', $nid, '=')
      ->expression('verwerkt', '1')
      ->execute();
  }

}
