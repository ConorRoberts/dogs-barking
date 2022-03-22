import fixAbbreviations from "./fixAbbreviations";

/**
 * Given a possible select statements, returns whether or not it is constructed correctly
 * @param text
 * @returns
 */
const isOptionClause = async (text: string) => {
    const fixedText = await fixAbbreviations(text);
    return /[A-Z]{2,6}|following/g.test(fixedText) && /[0-9]+\.[0-9]+/g.test(fixedText) && /credits/g.test(fixedText);
};

export default isOptionClause;
