<?php

namespace Drupal\jeroen_probeersels\Form;

use Drupal\Core\Form\FormInterface;
use Drupal\Core\Form\FormStateInterface;

class RemoveOrphanParagraphsForm implements FormInterface {

  public function buildForm(array $form, FormStateInterface $form_state): array {

    $form['batch_size'] = array(
      '#type' => 'number',
      '#title' => t('Batchsize'),
      '#required' => TRUE,
      '#default_value' => 1000
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
    return 'jeroen_probeersels_removeorphanparagraphs';
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {

    $batchSize = $form_state->getValue('batch_size');
    $aantal = removeOrphanParagraphs($batchSize);

    $message = 'Batch removeOrphanParagraphs ' . date("d-m-Y_H:i:s") . ' with ' . $batchSize . ' was started. Removed items :'. $aantal;

    drupal_set_message($message);
    \Drupal::logger('jeroen_probeersels')->info(t($message));
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {
    
  }

}
