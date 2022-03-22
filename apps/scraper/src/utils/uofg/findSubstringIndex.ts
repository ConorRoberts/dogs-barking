/**
 * Returns the first index where a string matches. -1 when no match is found
 * @param phrase
 * @param match
 */
const findIndex = (phrase: string, match: string): number => {
    const len: number = match.length;
    let tmpPhrase: string;
    for (let i = 0; i < phrase.length; i++) {
        tmpPhrase = phrase.substring(i, len + i);
        if (tmpPhrase === match) {
            return i;
        }
    }
    return 0;
};

export default findIndex;
