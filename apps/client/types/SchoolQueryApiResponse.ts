import School from "./School";

interface SchoolQueryApiResponse {
  schools: School[];
  total: number;
}

export default SchoolQueryApiResponse;
