import programAbbreviations from "config/programAbbreviations";

/**
 * Replaces instances of full program names with their abbreviations
 * @param text String containing program names
 * @returns The fixed string
 */
const fixAbbreviations = (text: string): string => {
    programAbbreviations.forEach(([name, abbr]) => (text = text.replace(name, abbr)));

    return text;
};

export default fixAbbreviations;
