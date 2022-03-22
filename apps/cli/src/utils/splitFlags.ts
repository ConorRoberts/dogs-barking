/**
 * Splits a set of flags starting with - ie: -hftrw into an array of characters
 * @param flags -> Command line flags to be split
 * @returns String[] -> of command line flags
 */
const splitFlags = (flags: string): string[] => {
    flags = flags.slice(1);
    const tmpArr = flags.split("");
    const retArr: string[] = [];
    for (let i = 0; i < tmpArr.length; i++) {
        if (!retArr.includes(tmpArr[i])) {
            retArr.push(tmpArr[i]);
        }
    }
    return retArr;
};

export default splitFlags;