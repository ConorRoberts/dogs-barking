import Clause from "@dogs-barking/common/types/Clause";
import fixAbbreviations from "./fixAbbreviations";

/**
 *
 * @param text
 */
const extractOptionClauses = (text: string) => {
    const fixedText = fixAbbreviations(text);
    const matches = fixedText.match(/([0-9]+\.[0-9+].*[A-Z]{2,6}|[0-9]+\.[0-9+].*following)/g) ?? [];
    const clauses: Clause[] = matches.map((str) => ({
        weight: parseFloat(str.match(/[0-9]+\.[0-9+]/g)?.at(0) ?? "0"),
        dpt:
            str
                .match(/[A-Z]{2,6} and [A-Z]{2,6}|[A-Z]{2,6}|following/g)
                ?.at(0)
                ?.toString() ?? "",
        level: parseInt(str.match(/[0-9]{4}/g)?.at(0) ?? "-1"),
    }));
    const sortedClauses = clauses
        .filter(({ weight, dpt }: Clause) => weight !== 0 && dpt)
        .sort(({ dpt: a }, { dpt: b }) => sortByClause(a, b));

    return sortedClauses;
};

/**
 *
 * @param param0
 */
const sortByClause = (a: string, b: string) => {
    if (!a) {
        return 1;
    } else if (!b) {
        return -1;
    }

    if (b === "following") {
        return -1;
    } else if (a === "following") {
        return 1;
    }

    return a.localeCompare(b);
};

export default extractOptionClauses;
