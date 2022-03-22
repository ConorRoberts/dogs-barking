/**
 * @param  {string} text?
 */
const getClassCounts = (text?: string) => {
    let labs = 0;
    let lectures = 0;

    if (text) {
        text.split(",").forEach((str) => {
            const numStr = str.match(/\d/g)?.join("");

            if (!numStr) return;

            const num = parseInt(numStr, 10);

            if (str.toUpperCase().includes("LAB")) {
                labs += num;
            } else if (str.toUpperCase().includes("LEC")) {
                lectures += num;
            }
        });
    }

    return {
        labs,
        lectures,
    };
};

export default getClassCounts;
