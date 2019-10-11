<?php

namespace Drupal\jeroen_probeersels\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\Block\BlockInterface;

/**
 * Provides an Jeroens probeer blok.
 *
 * @Block(
 *   id = "jeroen_probeersels_blok_config",
 *   admin_label = @Translation("Jeroens Blok met config"),
 * )
 */
class JeroensBlockConfig extends BlockBase implements BlockPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function build(): array {

    // Indien de text in code wijzigt, dan is dit pas zichtbaar na het legen van
    // de cache
    $config = $this->getConfiguration();
    $text = 'Hello there from the block JeroensBlockConfig <BR>' .
      '<A HREF="' . 'mailto:' . $config ['mail_value'] . '">mail naar 1</A><BR><BR> ';

    // De nette manier in D8 voor de laatste regel is:
    // een url object maken. 
    $url = Url::fromUri('mailto:' . $config ['mail_value']);
    // daarna een link object maken
    $link = Link::fromTextAndUrl('mail naar 2', $url);
    // en met de toString methode de html genereren
    $text = $text . $link->toString() ;
    
    $text = t($text);
    $build = ["#markup" => $text];
    return $build;
  }

  public function defaultConfiguration() {
    return array(
      'id' => $this->getPluginId(),
      'label' => 'jo Willey',
      'provider' => $this->pluginDefinition['provider'],
      'label_display' => BlockInterface::BLOCK_LABEL_VISIBLE,
      'cache' => array('max_age' => 0,),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, \Drupal\Core\Form\FormStateInterface $form_state) {
    //
    // Deze functie zorgt ervoor, dat het blok een extra configuratie veld emailadres krijgt.
    //
    $config = $this->getConfiguration();

    $form['mail_value'] = [
      '#type' => 'textfield',
      '#title' => t('Mail value'),
      '#description' => 'Geeft een emailadres op of laat leeg voor standaard site emailadres',
      '#default_value' => isset($config['mail_value']) ? $config['mail_value'] : '',
    ];

    return $form;
  }

  public function blockSubmit($form, \Drupal\Core\Form\FormStateInterface $form_state) {
    //
    // Deze functie zorgt ervoor, dat het opgegeven emailadres in de configuratie wordt
    // ge-submit.
    // Komt in tabel config in record met name = 'block.block.jeroensblokmetconfig'
    //
    $emailadres = $form_state->getValue('mail_value');
    $this->setConfigurationValue('mail_value', $emailadres);
  }

  public function blockValidate($form, \Drupal\Core\Form\FormStateInterface $form_state) {
    //
    // Validatie van het blok, indien deze faalt, dan wordt de Submit niet uitgevoerd.
    //
    $emailadres = $form_state->getValue('mail_value');
    if (strpos($emailadres, '@') == false) {
      $form_state->setErrorByName('JeroensBlockConfig', t('Emailadres moet een @ bevatten.'));
    }
  }

}
