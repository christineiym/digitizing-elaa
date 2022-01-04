/**
 * Creates a Google Form that allows respondents to rate a certain student's work.
 *
 * @param {Spreadsheet} ss The spreadsheet that contains the student data.
 * @param {Array<String[]>} studentList List of student names.
 */
function setUpForm(ss) {
    // Configure general form settings.
    var form = FormApp.create('Student Records Test Form');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())
        .setConfirmationMessage('Thanks for responding!')
        .setAllowResponseEdits(true)
        .setPublishingSummary(true)
        .setShowLinkToRespondAgain(true);

    // Add a dropdown question that lets the user select the student.
    var itemStudent = form.addListItem();
    itemStudent.setTitle('Student Name:')
        .setChoiceValues([NEW_STUDENT_PLACEHOLDER]);

    // TODO: add instructions for setting up file upload on form
    // may make a better HTML interface in the future, but that would require Drive read/write permission.

    // Add a grid question that lets the user rate the student's work.
    var itemScales = form.addGridItem();
    itemScales.setTitle('Please identify where the student\'s work falls on applicable scales:')
        .setRows([
            'Scale 1: Reading Literature & Informational Text: Key Ideas and Details',
            'Scale 2: Reading Literature: Key Ideas and Details',
            'Scale 3: Reading Informational Text: Integration of Knowledge and Ideas',
            'Scale 4: Reading Foundations: Letter Identification',
            'Scale 5: Writing: Text Types and Purposes',
            'Scale 6: Language: Vocabulary Acquisition and Use'
        ])
        .setColumns([
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18'
        ]);

    // Add a checkbox question indicating the type of data used as evidence.
    var itemDataType = form.addCheckboxItem();
    itemDataType.setTitle('Type of data used as evidence:')
        .setChoices([
            itemDataType.createChoice('Anecdotal Note'),
            itemDataType.createChoice('Work Sample'),
            itemDataType.createChoice('Photograph'),
            itemDataType.createChoice('Video'),
            itemDataType.createChoice('Performance Data')
        ]);

    // Add a free-response question for the text title.
    var itemTitle = form.addTextItem();
    itemTitle.setTitle('Title of text used:');

    // Add a multiple-choice question for text familiarity.
    var itemFamiliarity = form.addMultipleChoiceItem();
    itemFamiliarity.setTitle('Familiarity of text to student:')
        .setChoices([
            itemFamiliarity.createChoice('Familiar'),
            itemFamiliarity.createChoice('Unfamiliar (New)')
        ]);

    // Add a multiple-choice question for text type (literature/informational).
    var itemTextType = form.addMultipleChoiceItem();
    itemTextType.setTitle('Type of text:')
        .setChoices([
            itemTextType.createChoice('Literature'),
            itemTextType.createChoice('Informational')
        ]);

    // Add a multiple choice question for level of support.
    var itemSupportLevel = form.addMultipleChoiceItem();
    itemSupportLevel.setTitle('Level of support:')
        .setChoices([
            itemSupportLevel.createChoice('Independent'),
            itemSupportLevel.createChoice('Guidance/Support')
        ]);

    // Add a free response question for AT or AAC set-up.
    var itemSetup = form.addParagraphTextItem();
    itemSetup.setTitle('Notes and description of AT or AAC was set up for student use:');

    // Add a free response question for the observation context and explanation of score.
    var itemObservationScoring = form.addParagraphTextItem();
    itemObservationScoring.setTitle('Context of observation/explanation of how the score was derived:');

    // Add a free response question for other notes.
    var itemOther = form.addParagraphTextItem();
    itemOther.setTitle('(Optional) Other notes:');

    return form;
}

function updateFormStudentList(className) {
    // Obtain relevant class data.
    var classes = PropertiesService.getUserProperties();
    var classInfo = JSON.parse(classes.getProperty(className));
    Logger.log(classInfo.students);

    // Update student list question by overwriting the student list.
    var form = FormApp.openById(classInfo.formID);
    var studentListQ = form.getItemById(classInfo.studentListQID).asListItem();  // TODO: account for potential changes to question type
    studentListQ.setChoiceValues(classInfo.students);
}