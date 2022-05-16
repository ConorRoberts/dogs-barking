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

class Parser {

    private options;
    private states = Parser_States;
    private fields = Object.values(Fields);

    constructor() {
        //TODO: setup instance vars, etc
    }
    set _options (options) {
        this.options = options;
    }
    setupParser () {
        //TODO: Parser setup
    }
    parseField () {
        //TODO: field parsing
    }
    parseCourse () {
        // TODO: Wrapper for parsing a course
    }
    parseProgram () {
        // TODO: Wrapper for parsing a program
    }
    parseAttribute () {
        //TODO: Wrapper for parsing attributes
    }
}