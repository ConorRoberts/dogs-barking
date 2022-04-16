/**
 * Returns the first index where a string matches. -1 when no match is found
 * @param phrase
 * @param match
 */
const findSubstringIndex = (phrase: string, match: string): number => {
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

/**
 *  Converts the string representation of prerequisites to an array representation
 */
const requisiteFormat = (preReqList?: string): string[] => {
  //console.log("Prereqs " + preReqList)
  if (!preReqList) return [];

  if (preReqList.includes("A minimum of 0.50 credits at the 4000-level in Studio Arts")) {
    preReqList = preReqList.replace(
      "A minimum of 0.50 credits at the 4000-level in Studio Arts",
      "0.50 Credits in 4000 Level Studio Arts"
    );
    preReqList = preReqList.replace(
      "a minimum cumulative average of at least 80% in SART courses and ARTH courses",
      "Minimum 80% Cumulative Average in SART and ARTH courses"
    );
  }
  if (preReqList.includes("including")) {
    const tmplist = preReqList.replace(/ including/g, ",");
    //preReqList = tmplist.join()
    preReqList = tmplist;
  }
  if (preReqList.includes("excluding")) {
    preReqList = preReqList.replace("(", "").replace(")", "");
    const index = findSubstringIndex(preReqList, "excluding");
    preReqList = preReqList.substring(0, index) + ", " + preReqList.substring(index);
  }
  if (preReqList.includes("excludes")) {
    preReqList = preReqList.replace("(", "").replace(")", "");
    const index = findSubstringIndex(preReqList, "excludes");
    preReqList = preReqList.substring(0, index) + ", " + preReqList.substring(index);
  }
  if (preReqList.includes("Completion of")) {
    preReqList = preReqList.slice(13);
  }
  if (preReqList.includes("one of the following,")) {
    preReqList = preReqList.replace("one of the following,", "1 of ");
  } else if (preReqList.includes("one of the following")) {
    preReqList = preReqList.replace("one of the following", "1 of ");
  }
  if (preReqList.includes("as appropriate to the topic of the course:")) {
    preReqList = preReqList.replace("as appropriate to the topic of the course:", "");
  }
  if (preReqList.includes(" of ")) {
    const tmplist = preReqList.split("of");
    tmplist[1] = tmplist[1].replace(/, /g, " / ").replace(")", "");
    tmplist[0] = tmplist[0].replace("(", "");
    tmplist[0] += "of";
    preReqList = tmplist.join("");
  }
  const preReqs = preReqList.split(",");
  for (let i = 0; i < preReqs.length; i++) {
    preReqs[i] = preReqs[i].replace("(", "").replace(")", "");
    preReqs[i] = preReqs[i].replace(/ or /g, " / ");
  }

  return preReqs.map((e) => e.trim());
};

export default requisiteFormat;
