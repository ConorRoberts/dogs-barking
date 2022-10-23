import CourseNode from "~/components/graph/nodes/CourseNode";
import OrBlockNode from "~/components/graph/nodes/OrBlockNode";
import CreditRequirementNode from "~/components/graph/nodes/CreditRequirementNode";
import AndBlockNode from "~/components/graph/nodes/AndBlockNode";
import ProgramNode from "~/components/graph/nodes/ProgramNode";

const nodeTypes = {
  Course: CourseNode,
  OrBlock: OrBlockNode,
  CreditRequirement: CreditRequirementNode,
  AndBlock: AndBlockNode,
  Program: ProgramNode,
};

export default nodeTypes;
