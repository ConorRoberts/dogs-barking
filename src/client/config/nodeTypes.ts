import CourseNode from "@components/CourseNode";
import OrBlockNode from "@components/OrBlockNode";
import CreditRequirementNode from "@components/CreditRequirementNode";
import AndBlockNode from "@components/AndBlockNode";

const nodeTypes = {
  Course: CourseNode,
  OrBlock: OrBlockNode,
  CreditRequirement: CreditRequirementNode,
  AndBlock: AndBlockNode,
};

export default nodeTypes;
