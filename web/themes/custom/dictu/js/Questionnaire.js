
(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.Questionnaire = {
        attach: function (context, settings) {

            initQuestionnaire({ 
                id: drupalSettings.dictu.questionnaire.form_id, 
                containerId:"questionnaire", 
                publisherUri:"https://publisher.formsengine.io", 
            
                analyticsURL: "https://www.dictu.nl/formulieren/{FORM_NAME}/stap{STEP}.php", 
            
                initAnswersId:""
            }); 
        }
    };
})(jQuery, Drupal, drupalSettings);
