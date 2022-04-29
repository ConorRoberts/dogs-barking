import CourseNode from "@components/CourseNode";
import PrerequisiteBlockNode from "@components/PrerequisiteBlockNode";
import CreditRequirementNode from "@components/CreditRequirementNode";
import AndBlockNode from "@components/AndBlockNode";

const nodeTypes = {
  Course: CourseNode,
  OrBlock: PrerequisiteBlockNode,
  CreditRequirement: CreditRequirementNode,
  AndBlock: AndBlockNode,
};

export default nodeTypes;
