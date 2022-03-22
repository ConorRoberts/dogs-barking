const cases = [
    {
        input: "ECO204Y1/ ECO206Y1; ECO220Y1/ ECO227Y1/( STA220H1, STA255H1)*/( STA237H1, STA238H1)/( STA257H1, STA261H1)",
        output: [
            "ECO204Y1 / ECO206Y1",
            "ECO220Y1 / ECO227Y1 / (STA220H1 & STA255H1) / (STA237H1 & STA238H1) / (STA257H1 & STA261H1)"
        ]
    },
    {
        input: "RSM219H1, RSM220H1, RSM221H1, RSM222H1, RSM225H1, RSM230H1, RSM250H1, RSM260H1, RSM270H1",
        output: [
            "RSM219H1",
            "RSM220H1",
            "RSM221H1",
            "RSM222H1",
            "RSM225H1",
            "RSM230H1",
            "RSM250H1",
            "RSM260H1",
            "RSM270H1"
        ]
    },
    {
        input: "( AFR280Y1, AFR380Y1)/ ( FSL221Y1, FSL321Y1/ FSL421Y1)/ ( NML110Y1, NML210Y1)/ ( PRT100Y1, PRT220Y1)",
        output: [
            "(AFR280Y1 & AFR380Y1) / (FSL221Y1 & FSL321Y1 / FSL421Y1) / (NML110Y1 & NML210Y1) / (PRT100Y1 & PRT220Y1)"
        ]
    },
    {
        input: "CIN211H1/​ CIN230H1/​ CIN270Y1/​ CIN310Y1/​ CIN334H1/​ CIN335H1/​ CIN374Y1/​ CIN431H1/​ CIN490Y1/​ CIN491H1/​ CIN492H1/​ ENG250H1/​ ENG235H1/​ ENG270H1/​ ENG355Y1/​ ENG360H1/​ ENG363Y1/​ ENG364Y1/​ ENG365H1/​ ENG368H1/​ ENG379H1/​ ENG397H1/​ ENG484H1/​ MUS306H1/​ RLG315H1/​ CAR324H1/​ JLN427H1/​ CDN368H1",
        output: [
            "CIN211H1 / CIN230H1 / CIN270Y1 / CIN310Y1 / CIN334H1 / CIN335H1 / CIN374Y1 / CIN431H1 / CIN490Y1 / CIN491H1 / CIN492H1 / ENG250H1 / ENG235H1 / ENG270H1 / ENG355Y1 / ENG360H1 / ENG363Y1 / ENG364Y1 / ENG365H1 / ENG368H1 / ENG379H1 / ENG397H1 / ENG484H1 / MUS306H1 / RLG315H1 / CAR324H1 / JLN427H1 / CDN368H1"
        ],
    },
    {
        input: "( BCH210H1, ( BCH311H1/​ CSB349H1/​ MGY311Y1))/ BCH242Y1",
        output: [
            "(BCH210H1 & (BCH311H1 / CSB349H1 / MGY311Y1)) / BCH242Y1"
        ]
    },
    {
        input: "( CSC111H1/​ CSC165H1, CSC236H1)/ CSC240H1 (1)",
        output: [
            "(CSC111H1 / CSC165H1 & CSC236H1) / CSC240H1"
        ]
    },
    {
        input: "( ECO101H1, ECO102H1), RSM100H1/​ MGT100H1",
        output: [
            "ECO101H1",
            "ECO102H1",
            "RSM100H1 / MGT100H1",
        ]
    }
];

const newFunction = (input: string) => {
    // const result: string[] = [];
    const courseCodes = input.match(/[A-Z]{3}[0-9]{3}[A-Z][0-9]/g) ?? [];
    return courseCodes.join(" / ");
    // filteredInput[0].split(";")
    //     .forEach((e) => {
    //         let str = e
    //             .replace(/[\u200B-\u200D\uFEFF]/g, "")
    //             .replace(/,|(and)/g, " & ")
    //             .replace(/\*/g, "")
    //             .replace(/\//g, " / ")
    //             .replace(/\( /g, "(")
    //             .replace(/ \)/g, ")")
    //             .replace(/ {2}/g, " ")
    //             .trim();

    //         // Check for some garbage in there
    //         if (/\([0-9]\)/g.test(str)) {
    //             str = str.replace(/\([0-9]*\)/g, "").trim();
    //         }

    //         if (/\(|\)|\//g.test(str)) {
    //             result.push(str);
    //         } else {
    //             result.push(...str.replace(/ +/g, "").split("&"));
    //         }
    //     });

    // return result;
};

test("formatCoursesLine", () => {

    cases.forEach((e) => {
        // const uotCourseCodeRegex = new RegExp(/[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?/g);
        // const courseCodes = e.input.match(uotCourseCodeRegex) ?? [];

        const output = newFunction(e.input);

        expect(output).toEqual(e.output);
    });
});