import Course from "./Course";
import Option from "./Option";

type Area = {
    label: string;
    required: Course[];
    electives: Option[];
};
export default Area;
