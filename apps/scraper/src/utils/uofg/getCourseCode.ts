const getDigits = new RegExp(/\d+/g);
const getLetters = new RegExp(/[a-zA-Z]+/g);

type GetCourseCodeOutput = {
    courseNumber: number;
    departmentCode: string;
};

/**
 * @param  {string} text
 * @returns string
 */
const getCourseCode = (text: string): GetCourseCodeOutput => {
    if (text) {
        if (text.includes("*")) {
            const [departmentCode, courseNumber] = text.split("*");
            return {
                courseNumber: +courseNumber,
                departmentCode: departmentCode,
            };
        }

        return {
            courseNumber: parseInt(text.match(getDigits)?.join("") ?? "0"),
            departmentCode: text.match(getLetters)?.join("") ?? "NONE",
        };
    }

    return {
        courseNumber: 0,
        departmentCode: "",
    };
};

export default getCourseCode;
