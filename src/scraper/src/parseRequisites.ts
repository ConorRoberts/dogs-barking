import { readFileSync, writeFileSync } from "fs";

// Define the requisite type
interface Requisite {
  type: string;
  num?: number;
  code?: string;
  degree?: string;
  list?: any;
}

// Strips everything except:
// commas, periods, round brackets, and square brackets
function stripExtraPunctuation(s: string) {
  return s.replace(/[^\w\s,.()\[\]]|_/g, "");
}

// Strips brackets and terminating commas
function stripBrackets(s: string) {
  s = s.replace(/[^\w\s,.]|_/g, "");
  if (s.slice(0, 2) == ", ") s = s.slice(2, s.length);
  if (s[s.length - 1] == ",") s = s.slice(0, -1);
  return s;
}

// Handles case where a string ends with a period
function cleanUp(s: string) {
  if (s[s.length - 1] == ".") {
    s = s.slice(0, -1);
  }

  return s.trim();
}

// Find a phrase and create an associated variable
function processPhrase(type: string, phrase: string, inString: string, reqList: any) {
  const req: Requisite = {
    type: type,
  };

  if (inString.includes(phrase)) {
    if (phrase == "registration in") {
      // Grabs everything after the phrase
      req.degree = inString.split("registration in ")[1];
    } else if (phrase == "Registration in") {
      // Grabs everything after the phrase
      const words = inString.split(" ");
      words.shift();
      words.shift();
      req.degree = words.join(" ");
    }
    reqList.push(req);
    inString = inString.replace(phrase, "");
    inString = inString.trim();
  }

  inString = cleanUp(inString);

  return [inString, reqList];
}

// Converts a string to a list of requisites
function parseRequisites(s: string) {
  // Declare variables
  let out = [];
  let reqList = [];
  let reqBuilder = "";
  let endDelim = ",";
  const word = s;

  // Split requirements into an array
  // loop through the string and break it up according to the delimeters: ",", "(", "["
  for (let i = 0; i < word.length; i++) {
    reqBuilder = reqBuilder + word[i];

    // Case: Delimeter
    if (word[i] == endDelim) {
      reqBuilder = stripBrackets(reqBuilder);

      if (reqBuilder.length > 3) reqList.push(reqBuilder.trim());

      reqBuilder = "";
      endDelim = ",";
      continue;
    } else if (word[i] == "(") endDelim = ")";
    else if (word[i] == "[") endDelim = "]";

    // Case: End of Line
    if (i + 1 == word.length) {
      reqBuilder = stripBrackets(reqBuilder);
      if (reqBuilder.slice(0, 2) == ", ") reqBuilder = reqBuilder.slice(2, reqBuilder.length);
      if (reqBuilder[reqBuilder.length - 1] == ",") reqBuilder = reqBuilder.slice(0, -1);

      if (reqBuilder.length > 3) reqList.push(reqBuilder.trim());
    }
  }

  out = reqList;

  // Convert from string requisites to objects
  reqList = [];
  for (let i = 0; i < out.length; i++) {
    const subReq = out[i];

    const req: Requisite = {
      type: "Course",
    };

    const splitReq = subReq.split(" ");

    // Search for separators:
    // of, and, or, in
    if (subReq.includes(" of ")) {
      req.num = parseInt(splitReq[0]);
      req.type = "of";
      splitReq.shift();
      splitReq.shift();
      req.list = splitReq.join(" ").split(", ");
    } else if (subReq.includes(" or ")) {
      req.type = "or";
      req.list = subReq.split(" or ");
    } else if (subReq.includes(" and ")) {
      req.type = "and";
      let courses = subReq.split(" and ");
      courses = courses.map((course: string) => {
        return { type: "Course", code: course };
      });
      reqList.push(...courses);
      continue;
    } else if (subReq.includes(" in ")) {
      req.num = parseInt(splitReq[0]);
      req.type = "in";
      splitReq.shift();
      splitReq.shift();
      req.list = splitReq.join(" ").split(", ");
    }

    // If the type was not changed, it's a list of courses
    if (req.type == "Course") {
      let courses = subReq.split(", ");
      courses = courses.map((course: string) => {
        return { type: "Course", code: course };
      });
      reqList.push(...courses);
      continue;
    }

    reqList.push(req);
  }

  out = reqList;

  return out;
}

// Takes input string and outputs as a list of requirement objects
export default function reqToList(inString: string) {
  // Declare variables / objects
  let reqList = [];

  // Remove unusable punctuation
  inString = stripExtraPunctuation(inString);

  // Remove unusable phrase
  // Reason: Just a way of saying you're looking at a requisite
  inString = inString.replace("Must be completed prior to taking this course", "");
  inString = cleanUp(inString);

  // Parse and store special phrases
  [inString, reqList] = processPhrase(
    "Supervisor Permission",
    "written permission of the faculty supervisor",
    inString,
    reqList
  );
  [inString, reqList] = processPhrase(
    "Prior/Same",
    "Must be taken either prior to or at the same time as this course",
    inString,
    reqList
  );
  [inString, reqList] = processPhrase("Degree Registration", "registration in", inString, reqList);
  [inString, reqList] = processPhrase("Degree Registration", "Registration in", inString, reqList);

  let notParsedYet = true; // Boolean that keeps track of nesting requisites

  // Parse the prefixes / connector words
  if (inString.split(" ").length > 2) {
    let words = inString.split(" ");

    // Remove: "Completion of", "Minimum of", "Take"
    const prefix = words[0] + " " + words[1];
    if (prefix == "Minimum of" || prefix == "Completion of") {
      words.shift();
      words.shift();
    } else if (words[0] == "Take") {
      words.shift();
    }

    words = cleanUp(words.join(" ")).split(" ");

    // Parse and store:
    // "n credits", "n of", "including", "and", "or"
    if (words[1].replace(",", "") == "credits" && words[0][0] != "(" && words[0][0] != "[") {
      const req: Requisite = {
        type: "Credits",
        num: parseFloat(words[0]),
      };

      words.shift();
      words.shift();

      if (words.length > 0 && words[0] == "including") {
        req.type = "Credits including";
        words.shift();
      }

      inString = cleanUp(words.join(" "));
      if (inString.length > 1) req.list = parseRequisites(inString);
      notParsedYet = false;
      reqList.push(req);
    } else if (words[1] == "of" && words[0][0] != "(" && words[0][0] != "[") {
      const req: Requisite = {
        type: "of",
        num: parseFloat(words[0]),
      };

      words.shift();
      words.shift();

      inString = cleanUp(words.join(" "));
      req.list = parseRequisites(inString);
      notParsedYet = false;
      reqList.push(req);
    }
  }

  // Split what's left into requisites
  if (notParsedYet) reqList.push(...parseRequisites(inString));
  return reqList;
}
