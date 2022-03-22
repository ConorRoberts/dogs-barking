export interface LogScrapingProgressArgs {
    departmentIndex: number;
    departmentCount: number;
    courseDepartment: string;
    courseNumber: number;
}

/**
 * General purpose logging function for the scraper. Reports current course/department to console.
 * @param {*} data
 */
const logScrapingProgress = (data: LogScrapingProgressArgs) => {
    const { departmentIndex, departmentCount, courseDepartment, courseNumber } = data;

    console.log(
        `${Math.round((departmentIndex / departmentCount) * 100)
            .toString()
            .padStart(3, "00")}% | Currently scraping ` +
            courseDepartment +
            courseNumber
    );
};

export default logScrapingProgress;
