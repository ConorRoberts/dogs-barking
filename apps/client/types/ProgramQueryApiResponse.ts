import Program from "./Program";

interface ProgramQueryApiResponse {
  programs: Program[];
  total: number;
}

export default ProgramQueryApiResponse;
