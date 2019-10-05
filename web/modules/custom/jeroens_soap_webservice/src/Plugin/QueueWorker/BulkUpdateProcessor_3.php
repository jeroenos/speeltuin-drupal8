<?php

namespace Drupal\jeroens_soap_webservice\Plugin\QueueWorker;

/**
 * Processes Obama Bulk udpates for My Module.
 *
 * @QueueWorker(
 *   id = "obama_runner_3",
 *   title = @Translation("Obama SOAP Webservice Task Worker 3: Bulk Update"),
 *   cron = {"time" = 300}
 * )
 */
class BulkUpdateProcessor_3 extends BulkUpdateProcessor {
  
}
