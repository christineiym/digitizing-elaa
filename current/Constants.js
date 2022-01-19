const ORANGE = "#FF8000";
const NEW_STUDENT_PLACEHOLDER = "New Student ";
const STUDENT_LIST_PLACEHOLDER = [];
const STUDENT_LIST_SELECTIONS_FIELD_NAME = "student_list_selections";
const START_DATE_FIELD_NAME = "start_date";
const END_DATE_FIELD_NAME = "end_date";
const MAX_EXAMPLES_FIELD_NAME = "max_examples";
const GENERIC_PLACEHOLDER = "";
const ONE_YEAR_INCREMENT = 1;
const LIMIT_MAX_EXAMPLES = 3;  // TODO: change to a clearer name
const MAXIMUM = "Maximum";
const ZERO = 0;
const DEFAULT_PLACEHOLDER = {};
const TEMPLATE_URL = "https://docs.google.com/presentation/d/1OIRWiXMlvBu221rMOR6aO-dVU3mbcoP1O5OvhgeAQlQ/edit?usp=sharing";
const NEW_LINE = "\n";

// 1-indexed column locations
const TIMESTAMP_COLUMN = 1;
const NAME_COLUMN = 2;
const SCALE_COLUMN_START = 3;
const SCALE_COLUMN_END = 8;

const COLUMNS = {
    TIMESTAMP: 0,
    NAME: 1,
    SCALE_1: 2,
    SCALE_2: 3,
    SCALE_3: 4,
    SCALE_4: 5,
    SCALE_5: 6,
    SCALE_6: 7,
    DATA_TYPE: 8,
    TEXT_TITLE: 9,
    FAMILIARITY: 10,
    TEXT_TYPE: 11,
    SUPPORT_LEVEL: 12,
    AT_OR_AAC_SETUP: 13,
    CONTEXT: 14,
    OTHER: 15,
    EVIDENCE: 16
};
Object.freeze(COLUMNS);

// Template Placeholders
const TEMPLATE_PLACEHOLDERS = {
    STUDENT_NAME: "{{student_name}}",
    STUDENT_ID: "{{student_id}}",
    STUDENT_GRADE: "{{student_grade}}",
    DATE: "{{date}}",
    TEXT_TITLE: "{{text_title}}",
    AT_OR_AAC_SET_UP: "{{AT_or_AAC_set_up}}",
    EXPLANATION: "{{context_or_scoring_explanation}}"
};

const TEMPLATE = {
    BACKGROUND: 0,
    student_name: 1,
    student_id: 2,
    student_grade: 3,
    date: 4,
    ASSESSMENT_WINDOW: {
        FALL: 5,
        WINTER: 6,
        SPRING: 7
    },
    EVIDENCE_NUMBER: {
        START: 8,
        END: 10  // TODO: check if END is necessary
    },
    STUDENT_PERFORMANCE_SCORE: {
        E: 11,
        START: 12,
        END: 29  // TODO: check if END is necessary
    },
    DATA_TYPE: {
        ANECDOTAL_NOTE: 30,
        WORK_SAMPLE: 31,
        PHOTOGRAPH: 32,
        VIDEO: 33,
        PERFORMANCE_DATA: 34
    },
    text_title: 35,
    FAMILIARITY: {
        FAMILIAR: 36,
        UNFAMILIAR: 37
    },
    TEXT_TYPE: {
        LITERATURE: 38,
        INFORMATIONAL: 39
    },
    SUPPORT_LEVEL: {
        INDEPENDENT: 40,
        GUIDANCE_OR_SUPPORT: 41
    },
    AT_or_AAC_set_up: 42,
    context_or_scoring_explanation: 43
};
Object.freeze(TEMPLATE);  // TODO: deep freeze