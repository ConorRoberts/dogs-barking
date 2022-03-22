/**
 * 
 * @param text 
 */
const getCreditWeight = (text: string): number => {
    if (text === "H") {
        return 0.5;
    } else if (text === "Y") {
        return 0.75;
    }
    return 0;
};

export default getCreditWeight;