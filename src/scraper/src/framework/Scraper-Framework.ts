/**
* This will be the home of the general scraper framework, used to create specific integrations for other sites
*/

import writeFileSync from "fs";
import {devices, chromium, ElementHandle} from "@playwright/test";
import chalk from "chalk";

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

const courses = [];
const labs = [];
const lectures = [];
const seminars = [];
const tutorials = [];
const exams = [];
const sections = [];
const instructors = [];

//TODO: Migrate to winston logging, host online if possible
const logs = [];

module.exports = {
    Scraper_States,
    initialize: async () => {
        //TODO: Setup scraper/browser
    },
    scrapeCourseCalendar: async () => { // primary driver for getting courses data
        //TODO: Outline function calls
        if (this.goToCourseCalendar) {
            //TODO: call goToCourseCalendar
        } else {
            console.log("goToCourseCalendar not defined... skipping");
        }
        if (this.getCourses) {
            //TODO call getCourses
        } else {
            console.log("GetCourses not defined... skipping");
        }
        if (this.parseCourses) {
            //TODO: parser call
        } else {
            console.log("No parsing method found...");
        }
    },
    scrapeProgramsCalendar: async () => { // primary driver for scraping programs data
        //TODO: Outline function calls
        if (this.goToPrograms) {
            //TODO: goToPrograms integration
        } else {
            console.log("goToPrograms Not defined... skipping");
        }
        if (this.getPrograms) {
            //TODO: getPrograms call
        } else {
            console.log("getPrograms Not defined... skipping");
        }
        if (this.getProgram) {
            //TODO: getProgram call
            console.log("getProgram not defined skipping...");
        }
        if (this.parseProgram) {
            //TODO: parser call
        } else {
            console.log("No parsing method found...");
        }
    },
    _parseCourses: async () => {
        //TODO: call parser and store courses in DB
    },
    _storeCourses: async () => {
        //TODO: Take scraped courses and store into DB
    },
    scrape: async () => {
        //TODO: Define a base scraper function
        // When the above methods are not suffice
    },
};
