<?php

namespace Drupal\jeroens_soap_webservice\Plugin\QueueWorker;

/**
 * Processes Jeroens Bulk udpates for My Module.
 *
 * @QueueWorker(
 *   id = "obama_runner_1",
 *   title = @Translation("Obama SOAP Webservice Task Worker 1: Bulk Update"),
 *   cron = {"time" = 300}
 * )
 */
class BulkUpdateProcessor_1 extends BulkUpdateProcessor {
  
}
