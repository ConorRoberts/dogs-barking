/**
* This will be the home of the generalized parser framework, used to create specific parsing integrations
*/

export enum Parser_States {
    INITIALIZED,
    PARSED_DEPT,
    PARSED_COURSE_NUM,
    PARSED_COURSE_CODE,
    PARSED_COURSE_NAME,
    PARSED_COURSE_DESC,
    PARSED_COURSE_WEIGHT,
    PARSED_SCHOOL,
    PARSED_REQUIREMENTS,
    FINISHED,
};

const Fields = {
    DEPT: Symbol.for("DEPT"),
    COURSE_NUM: Symbol.for("COURSE_NUM"),
    COURSE_CODE: Symbol.for("COURSE_CODE"),
    COURSE_NAME: Symbol.for("COURSE_NAME"),
    COURSE_DESC: Symbol.for("COURSE_DESC"),
    COURSE_WEIGHT: Symbol.for("COURSE_WEIGHT"),
    SCHOOL: Symbol.for("SCHOOL"),
    REQUIREMENTS: Symbol.for("REQUIREMENTS"),
};

module.exports = {
    Parser_States,
    Fields,
    Options_Default: {},
    Required_Fields: Object.values(Fields),
    ParseField: async (options = {}) => {
        // TODO: Lay Down Basic Logic for parsing fields
    },
    DEFAULT_PARSING: {
        [Fields.DEPT]: async (element, options = {}) => {
        },
        [Fields.COURSE_NUM]: async (element, options = {}) => {},
        [Fields.COURSE_CODE]: async (element, options = {}) => {},
        [Fields.COURSE_NAME]: async (element, options = {}) => {},
        [Fields.COURSE_DESC]: async (element, options = {}) => {},
        [Fields.COURSE_WEIGHT]: async (element, options = {}) => {},
        [Fields.SCHOOL]: async (element, options = {}) => {},
        [Fields.REQUIREMENTS]: async (element, options = {}) => {},        
    },
    setupParser: async () => {
        //TODO: setup a basis for parsing data 
    },
    parseAttribute: async () => {
        //TODO: Define logic for parsing a single attribute
    },
    parseCourse: async () => {
        //TODO: define logic for generic parsing
        // Only to be used when the above is not suffice
    },
}