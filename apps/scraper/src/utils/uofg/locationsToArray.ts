/**
 * Converts the list of locations to an array representation
 */
const locationsToArray = (locations: string): string[] => {
    const courseLocations = [];
    if (locations && !(typeof locations === "undefined")) {
        if (locations.toLowerCase().includes("distance education format in odd-numbered years")) {
            courseLocations.push("Distance Education (DE) (Odd-Numbered Years)");
        } else if (locations.toLowerCase().includes("distance education format in even-numbered years")) {
            courseLocations.push("Distance Education (DE) (Even-Numbered Years)");
        } else if (locations.toLowerCase().includes("distance education")) {
            courseLocations.push("Distance Education (DE)");
        } else if (locations.toLowerCase().includes("even-numbered")) {
            courseLocations.push("In-Class (Even-Numbered Years)");
        } else if (locations.toLowerCase().includes("odd-numbered")) {
            courseLocations.push("In-Class (Odd-Numbered Years)");
        } else if (
            locations.toLowerCase().includes("first offering") ||
            locations.toLowerCase().includes("last offering")
        ) {
            const splits = locations.split("-");
            for (let i = 0; i < splits.length; i++) {
                splits[i] = splits[i].trim().replace(".", "");
                console.log("splits[" + i + "]: " + splits[i]);

                // If a restriction is present... add it to the restrictions array.
                if (splits[i].toLowerCase().includes("restriction(s):")) {
                    const anotherSplit = splits[i].split("Restriction(s):");
                    for (let j = 0; j < anotherSplit.length; j++) {
                        anotherSplit[j] = anotherSplit[j].trim().replace(".", "");
                        //console.log("anotherSplit[" + j + "]: " + anotherSplit[j])
                    }

                    //console.log(splits[0] + " (" + anotherSplit[0] + ")")
                    courseLocations.push(splits[0].trim() + " (" + anotherSplit[0].trim() + ")");
                } else {
                    //console.log(splits[0] + " (" + splits[1] + ")")
                    courseLocations.push(splits[0].trim() + " (" + splits[1].trim() + ")");
                }
            }
        } else {
            courseLocations.push("In-Class");
        }
    }

    return courseLocations;
};

export default locationsToArray;
