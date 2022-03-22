/**
 * @param  {string} text?
 */
const getAssociatedDepartments = (text?: string) => {
    if (!text) {
        return [];
    }

    return text.split(",").map((equate) => equate.trim());
};

export default getAssociatedDepartments;
