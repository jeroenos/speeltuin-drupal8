<?php

namespace Drupal\obama_soap_webservice\Plugin\QueueWorker;

/**
 * Processes Obama Bulk udpates for My Module.
 *
 * @QueueWorker(
 *   id = "obama_runner_4",
 *   title = @Translation("Obama SOAP Webservice Task Worker 4: Bulk Update"),
 *   cron = {"time" = 300}
 * )
 */
class BulkUpdateProcessor_4 extends BulkUpdateProcessor {
  
}
