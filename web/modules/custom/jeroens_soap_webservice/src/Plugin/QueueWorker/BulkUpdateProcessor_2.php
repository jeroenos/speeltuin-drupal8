<?php

namespace Drupal\jeroens_soap_webservice\Plugin\QueueWorker;

/**
 * Processes Obama Bulk udpates for My Module.
 *
 * @QueueWorker(
 *   id = "obama_runner_2",
 *   title = @Translation("Obama SOAP Webservice Task Worker 2: Bulk Update"),
 *   cron = {"time" = 300}
 * )
 */
class BulkUpdateProcessor_2 extends BulkUpdateProcessor {
  
}
