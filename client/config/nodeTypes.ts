import CourseNode from "@components/CourseNode";
import OrBlockNode from "@components/OrBlockNode";
import CreditRequirementNode from "@components/CreditRequirementNode";
import AndBlockNode from "@components/AndBlockNode";
import ProgramNode from "@components/ProgramNode";

const nodeTypes = {
  Course: CourseNode,
  OrBlock: OrBlockNode,
  CreditRequirement: CreditRequirementNode,
  AndBlock: AndBlockNode,
  Program: ProgramNode,
};

export default nodeTypes;
