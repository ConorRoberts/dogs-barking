import Course from "./Course";
import CreditRequirementData from "./CreditRequirementData";
import OrBlockData from "./OrBlockData";

type Requirement = OrBlockData | Course | CreditRequirementData;

export default Requirement;
