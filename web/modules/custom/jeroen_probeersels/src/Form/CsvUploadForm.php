<?php

namespace Drupal\jeroen_probeersels\Form;

use Drupal\Core\Form\FormInterface;
use Drupal\Core\Form\FormStateInterface;

class CsvUploadForm implements FormInterface {

  public function buildForm(array $form, FormStateInterface $form_state): array {
    $path = 'private://csvupload/';
    file_prepare_directory($path, FILE_CREATE_DIRECTORY);

    $form['import_csv'] = array(
      '#type' => 'managed_file',
      '#title' => t('Upload csv bestand'),
      '#upload_location' => $path,
      '#default_value' => '',
      "#upload_validators" => array("file_validate_extensions" => array("csv")),
      '#states' => array(
        'visible' => array(
          ':input[name="File_type"]' => array('value' => t('Upload csv bestand')),
        ),
      ),
    );
    $form['actions'] = array(
      '#type' => 'actions',
    );
    $form['actions'] ['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Verwerk')
    );
    return $form;
  }

  public function getFormId(): string {
    return 'jeroen_probeersels_csv_upload';
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $fid = $form_state->getValue('import_csv');
    csvtotable($fid[0], ';');
    $num_rows = tabletoqueue();
    $message = 'Batch ' . date("d-m-Y_H:i:s") . ' with ' . $num_rows . ' items was added to the cron queue.';

    drupal_set_message($message);
    \Drupal::logger('jeroen_probeersels')->info(t($message));
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {
    $csv_file = $form_state->getValue('import_csv');
    if (empty($csv_file)) {
      $form_state->setErrorByName('jeroen_probeersels_csv_upload', t('Upload eerst een bestand.'));
    }
  }

}
