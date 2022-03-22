/**
 *  Converts the string representation of equates to an array representation
 */
const equatesToArray = (equatesList?: string) => {
    if (!equatesList) {
        return [];
    }

    return equatesList.split(",").map((equate) => equate.trim());
};

export default equatesToArray;
