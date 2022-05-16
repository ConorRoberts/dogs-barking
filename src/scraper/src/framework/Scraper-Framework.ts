/**
* This will be the home of the general scraper framework, used to create specific integrations for other sites
*/

import writeFileSync from "fs";
import {devices, chromium, ElementHandle} from "@playwright/test";
import chalk from "chalk";
import * as scraperUtils from './Scraper-Utils';

export enum Scraper_States { //TODO: Add end states
    INITIALIZED,
    FIND_COURSE_CALENDAR,
    FOUND_COURSE_CALENDAR,
    FIND_COURSES,
    FOUND_COURSES,
    PARSING_COURSES,
    PARSING_COURSE,
    PARSED_COURSE,
    PARSED_COURSES,
    FIND_PROGRAMS,
    FIND_PROGRAM,
    FOUND_PROGRAM,
    PARSING_PROGRAM,
    PARSED_PROGRAM,
    FINISHED,
};

export type Meeting = {
    days: string[];
    startTime: string;
    endTime: string;
    location?: string;
    id: number;
    room?: string;
};
class Scraper {
    private SchoolType;
    private logs;
    private programs;
    private courses;
    private labs;
    private lectures;
    private seminars;
    private tutorials;
    private exams;
    private sections;
    private instructors;

    constructor (School:string) { // instanciate the program
        this.initializeMembers();
        this.initialize();
        this.SchoolType = School;
    }

    private initializeMembers() { // setup all member variables
        this.logs = [];
        this.courses = [];
        this.labs = [];
        this.lectures = [];
        this.seminars = [];
        this.tutorials = [];
        this.exams = [];
        this.sections = [];
        this.instructors = [];
    }

    get _logs() {
        return this.logs;
    }

    /**Accessor Methods (Courses)*/

    get _courses() {
        return this.courses;
    }

    get _labs() {
        return this.labs;
    }

    get _lectures() {
        return this.lectures;
    }

    get _seminars() {
        return this.seminars;
    }

    /** Accessor methods: Programs */

    get _programs() {
        return this.programs;
    }

    initialize () {
        //TODO: initial setup of the scraper
        // Validation of data, open pages
    }

    /** Course Methods */
    scrapeCoursesCalendar () {
        //TODO: Implement scraping of the courses calendar, wrapper
    }

    goToCourseCalendar () {
        //TODO: navigate to the course calendar from webpage
    }

    goToCoursePage () {
        //TODO: navigate to a course page
    }

    getCourses () {
        //TODO: scrape courses from each page
    }

    parseCourses () {
        //TODO: call parser and store courses in DB
    }

    storeCourses () {
        //TODO: Take scraped courses and store into DB
    }
    
    /** programs methods */
    scrapeProgramsCalendar () {
        //TODO: Implement scraping of programs calendar
    }

    goToProgramCalendar () {

    }

    goToProgramPage () {
    
    }

    getMajors () {

    }

    getMinors () {

    }

    getAOA() {
    }

    _parseProgram() {

    }

    _storeProgram() {

    }

    scrape () {
        //TODO: Define a base scraper function
        // When the above methods are not suffice
    }
}
