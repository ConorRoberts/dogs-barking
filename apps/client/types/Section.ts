import Option from "./Option";

type Section = {
    courses: {
        course?: string;
        section?: string;
        subsection?: string;
    }[];

    options: Option[];
};

export default Section;
