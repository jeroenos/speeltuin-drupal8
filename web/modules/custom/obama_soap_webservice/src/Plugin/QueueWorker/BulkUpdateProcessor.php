<?php

namespace Drupal\obama_soap_webservice\Plugin\QueueWorker;

use Drupal\node\Entity\Node;
use Drupal\Core\Queue\QueueWorkerBase;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\obama_soap_webservice\Soap\Types\ObjectType;
use Drupal\obama_soap_webservice\Soap\Types\DomeinType;
use Drupal\taxonomy\Entity\Term;

/**
 * Processes Obama Bulk udpates for My Module.
 *
 */
class BulkUpdateProcessor extends QueueWorkerBase {

  /**
   * {@inheritdoc}
   */
  public function processItem($data) {

    \Drupal::logger('obama_soap_webservice')->notice(
      'Verwerking ' . $data->oordelen->batchId . '/' . $data->oordelen->volgNr
      . ' - ' . $data->object->vestigingsnummer
      . ' - ' . $data->object->kvknummer
      . ' - ' . $data->object->handelsnaam
    );

    $oordeelTermMap = [
      'NOK' => '17',
      'OK' => '18',
      'NB' => '31',
      'NVT' => '',
    ];

    $node = $this->findOrCreateNode($data->object);

    // Set object data.
    $object = $data->object;
    $node->set('title', $object->handelsnaam ? $object->handelsnaam : 'Onbekend');
    $node->set('field_bedrijf', $object->handelsnaam);


    // Set adres data.
    $adres = $object->adres;
    $node->set('field_plaats', $adres->woonplaatsNaam);
    $node->set('field_postcode', $adres->postcode);
    $node->set('field_straat_huisnummer', trim($adres->straatnaam . ' ' . $adres->huisnummer . ' ' . $adres->huisnummertoevoeging . ' ' . $adres->huisletter));

    // Set locatie data.
    $locatie = $object->locatie;

    // Create a point using wkt_generator service
    if (!empty($locatie->breedtegraad)) {
      $lat = $locatie->breedtegraad;
      $lon = $locatie->lengtegraad;
      $coord = [$lon, $lat];
      $point = \Drupal::service('geofield.wkt_generator')->WktBuildPoint($coord);
    }
    else {
      $point = null;
    }

    $paragraphs = [];
    if (!empty($data->oordelen->oordeel)) {
      foreach ($data->oordelen->oordeel as $oordeel) {
        $bedrijfsTypeId = $this->findOrCreateTerm('bedrijfstype_thema_inspectieonde', $oordeel->domein->bedrijfstype);
        $themaId = $this->findOrCreateTerm('bedrijfstype_thema_inspectieonde', $oordeel->domein->omschrijving, $bedrijfsTypeId);

        $node->set('field_bedrijfsoordeel', $this->findOrCreateTerm('bedrijfsoordeel', $oordeel->omschrijving));

        $besluit = current($node->field_field_besluit_paragraph->getValue());
        if (isset($besluit['target_id'])) {
          $oordeelParagraph = Paragraph::load($besluit['target_id']);
        }
        else {
          $oordeelParagraph = Paragraph::create([
              'type' => 'besluit',
              'field_bedrijfsdomein' => $bedrijfsTypeId,
              'field_thema' => $themaId,
          ]);
        }

        // Eventuele bestaande onderwerpen verwijderen
        $currentOnderwerpParagraphIds = array_map(function ($ref) {
          return $ref['target_id'];
        }, $oordeelParagraph->field_onderwerp_paragraph->getValue());

        $this->deleteParagraph($currentOnderwerpParagraphIds);

        // en aangeleverde onderwerpen nieuw toevoegen       
        $onderwerpParagraphIds = [];
        foreach ($oordeel->onderwerpoordelen->onderwerpoordeel as $onderwerp) {
          $onderwerpId = $this->findOrCreateTerm('bedrijfstype_thema_inspectieonde', $onderwerp->onderwerp, $themaId);
          $onderwerpParagraph = Paragraph::create([
              'type' => 'onderwerp',
              'field_onderwerp' => $onderwerpId,
              'field_onderwerpoordeel' => $oordeelTermMap[$onderwerp->oordeel],
              'field_grondslag' => $this->findOrCreateTerm('grondslag', $onderwerp->grondslag),
              'field_datum_grondslag' => date('Y-m-d', strtotime($onderwerp->datumogrondslag)),
          ]);
          $onderwerpParagraph->save();
          $onderwerpParagraphIds[] = [
            'target_id' => $onderwerpParagraph->id(),
            'target_revision_id' => $onderwerpParagraph->getRevisionId(),
          ];
        }
        $oordeelParagraph->set('field_onderwerp_paragraph', $onderwerpParagraphIds);

        // Eventuele bestaande Formule-oordelen verwijderen
        $currentFormuleOordeelParagraphIds = array_map(function ($ref) {
          return $ref['target_id'];
        }, $oordeelParagraph->field_formule_oordeel_paragraph->getValue()
        );
        $this->deleteParagraph($currentFormuleOordeelParagraphIds);

        // Eventuele aangeleverde Formule-oordeel nieuw toevoegen       
        if (isset($oordeel->formulenaam)) {
          $formuleOordeelParagraph = Paragraph::create([
              'type' => 'formule_oordeel',
              'field_naam_formule_oordeel' => $oordeel->formulenaam,
              'field_oordeel_formule_oordeel' => $this->findOrCreateTerm('onderwerpoordeel', $oordeel->formuleoordeel)
          ]);

          $formuleOordeelParagraph->save();
          $formuleOordeelParagraphIds = array([
              'target_id' => $formuleOordeelParagraph->id(),
              'target_revision_id' => $formuleOordeelParagraph->getRevisionId(),
          ]);
          $oordeelParagraph->set('field_formule_oordeel_paragraph', $formuleOordeelParagraphIds);
        }
        $oordeelParagraph->set('field_batchid', $data->oordelen->batchId);
        $oordeelParagraph->set('field_geofield', $point);
        $oordeelParagraph->set('field_accuracy_geocoding', $locatie->nauwkeurigheid);
        $oordeelParagraph->set('field_reactie', $oordeel->reactie);
        $oordeelParagraph->save();
        $paragraphs[] = [
          'target_id' => $oordeelParagraph->id(),
          'target_revision_id' => $oordeelParagraph->getRevisionId(),
        ];
        break;  // Functioneel gezien is er maar 1 oordeel bij een object.
      }
      // Alleen als er een bedrijfsoordeel in het bericht zit het besluit bijwerken.
      $node->set('field_field_besluit_paragraph', $paragraphs);
    }

    // Zet de target_id('s) van field_maatregel_paragraph van het tzo in een array
    $currentMaatregelParagraphIds = array_map(function ($ref) {
      return $ref['target_id'];
    }, $node->field_maatregel_paragraph->getValue());

    // Eventuele bestaande maatregel(en) en gekoppelde overtredingen verwijderen
    $this->deleteParagraph($currentMaatregelParagraphIds);
    $currentMaatregelParagraphIds = [];

    if (!empty($data->maatregelen->maatregel)) {
      foreach ($data->maatregelen->maatregel as $maatregel) {
        $maatregelParagraph = Paragraph::create([
            'type' => 'maatregel',
            'field_bedrag_maatregel' => $maatregel->bedrag,
            'field_beslissing' => $maatregel->beslissing,
            'field_datum_maatregel' => $maatregel->datum,
            'field_motivering' => $maatregel->motivering,
            'field_reactie_maatregel' => $maatregel->reactie,
            'field_soort_maatregel' => $maatregel->soort,
            'field_status_maatregel' => $maatregel->status,
        ]);

        $currentOvertredingParagraphIds = [];
        foreach ($maatregel->overtredingen->overtreding as $overtreding) {
          $overtredingParagraph = Paragraph::create([
              'type' => 'overtreding',
              'field_feit' => $overtreding->feit,
              'field_bedrag_overtreding' => $overtreding->bedrag,
              'field_overtreding' => $overtreding->overtreding,
          ]);
          $overtredingParagraph->save();
          $currentOvertredingParagraphIds[] = [
            'target_id' => $overtredingParagraph->id(),
            'target_revision_id' => $overtredingParagraph->getRevisionId(),
          ];
        }

        $maatregelParagraph->set('field_overtreding_paragraph', $currentOvertredingParagraphIds);
        $maatregelParagraph->save();

        // target_id van zojuist aangemaakte maatregel paragraaf bijhouden in array
        $currentMaatregelParagraphIds[] = [
          'target_id' => $maatregelParagraph->id(),
          'target_revision_id' => $maatregelParagraph->getRevisionId(),
        ];
      }
    }
    // De eventuele aangemaakte maatregel paragrafen koppelen aan het tzo.
    $node->set('field_maatregel_paragraph', $currentMaatregelParagraphIds);

    try {
      $request_time = \Drupal::time()
        ->getCurrentTime();
      $node->setChangedTime($request_time);
      $node->save();
    }
    catch (Exception $err) {
      \Drupal::logger('obama_soap_webservice')->error('Could\'t save nnode', $err);
    }
  }

  /**
   * Find or create node of type 'toezichtsobject'.
   *
   * @param \Drupal\obama_soap_webservice\Soap\Types\ObjectType $object
   *   Object data.
   */
  protected function findOrCreateNode(ObjectType $object) {
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'toezichtsobject')
      ->condition('field_kvk_nummer', $object->kvknummer)
      ->condition('field_kvkvestgingsnummer', $object->vestigingsnummer)
      ->condition('field_bedrijf', $object->handelsnaam)
      ->condition('status', 1);

    $nids = $query->execute();

    $node = NULL;
    if ($nids) {
      $nid = current($nids);
      $node = Node::load($nid);
    }
    else {
      $node = Node::create([
          'type' => 'toezichtsobject',
          'field_kvk_nummer' => $object->kvknummer,
          'field_kvkvestgingsnummer' => $object->vestigingsnummer,
          'field_bedrijf' => $object->handelsnaam,
      ]);
    }

    return $node;
  }

  /**
   * Find or create a term in the vocabulary 'bedrijfstype_thema_inspectieonde.
   *
   * @param string $vid
   *   ID of the vocabulary.
   * @param string $name
   *   Name of the term.
   * @param int $parentId
   *   Parent ID.
   *
   * @return mixed
   *   ID of the term.
   */
  protected function findOrCreateTerm($vid, $name, $parentId = 0) {
    $query = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $query->join('taxonomy_term__parent', 'h', 'h.entity_id = t.tid');
    $query->addField('t', 'tid');
    $query->condition('h.parent_target_id', $parentId);
    $query->condition('t.vid', $vid);
    $query->condition('t.name', $name);
    $query->condition('t.default_langcode', 1);
    $query->addTag('taxonomy_term_access');
    $query->orderBy('t.weight');
    $query->orderBy('t.name');

    $tids = $query->execute()->fetchCol();
    if (!empty($tids)) {
      return current($tids);
    }

    $term = Term::create([
        'vid' => $vid,
        'name' => $name,
    ]);

    if ($parentId) {
      $term->parent = ['target_id' => $parentId];
    }

    $term->save();

    return $term->tid->getString();
  }

  /**
   * Delete a paragraph.
   *
   * @param array $ids
   *   List of paragraph ID's to include. Only paragraphs in this list
   *   are returned.
   *
   */
  protected function deleteParagraph(array $ids = []) {
    $storage_handler = \Drupal::entityTypeManager()->getStorage('paragraph');
    $entities = $storage_handler->loadMultiple($ids);
    $storage_handler->delete($entities);
  }

}
