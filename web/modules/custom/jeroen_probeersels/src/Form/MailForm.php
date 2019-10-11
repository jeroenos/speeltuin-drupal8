<?php

namespace Drupal\jeroen_probeersels\Form;

use Drupal\Core\Form\FormInterface;
use Drupal\Core\Form\FormStateInterface;

class MailForm implements FormInterface {

  public function buildForm(array $form, FormStateInterface $form_state): array {
    $account = \Drupal::currentUser();
    $mail = $account->getEmail();

    // De velde van het formulier
    $form['user_mail'] = array(
      '#type' => 'email',
      '#title' => t('E-mail'),
      '#required' => TRUE,
      '#default_value' => $mail
    );

    // Zelf de acties toevoegen
    $form['actions'] = array(
      '#type' => 'actions',
    );
    $form['actions'] ['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Toevoegen')
    );


    return $form;
  }

  public function getFormId(): string {
    return 'mail_form_add';
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {

    drupal_set_message('Boem');
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {
    $emailadres = $form_state->getValue('user_mail');
    if (strpos($emailadres, 'x') == false) {
      $form_state->setErrorByName('MailForm', t('Emailadres moet een x bevatten.'));
    }
  }

}
