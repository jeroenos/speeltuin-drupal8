<?php

namespace Drupal\jeroen_probeersels\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Block\BlockInterface;

/**
 * Provides an Jeroens probeer blok.
 *
 * @Block(
 *   id = "jeroen_probeersels_blok_mailform",
 *   admin_label = @Translation("Jeroens Block MailForm"),
 * )
 */
class JeroensBlockMailForm extends BlockBase implements BlockPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function build(): array {

    $form = \Drupal::formBuilder()->getForm('Drupal\jeroen_probeersels\Form\MailForm');

    $build = ["#markup" => render($form)];
    return $build;
  }

  public function defaultConfiguration() {
    /**
     * Zonder deze functie krijgt het blok ook een default configuratie.
     * Echter als deze functie ge-implementeerd wordt, dan kun je de waarden van
     * de default configuratie zelf bepalen. De titel wordt dan  'jo Willey' ipv
     * "Jeroens Blockie"
     */
    return array(
      'id' => $this->getPluginId(),
      'label' => 'Mail formulier in blok',
      'provider' => $this->pluginDefinition['provider'],
      'label_display' => BlockInterface::BLOCK_LABEL_VISIBLE,
      'cache' => array('max_age' => 0,),
    );
  }

}
