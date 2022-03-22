interface ApiRoute {
  path: string;
  methods: ApiMethod[];
}

export interface ApiMethod {
  method: "GET" | "POST" | "UPDATE" | "DELETE";
  desc: string;
  output: object[] | object;
  input: object;
}

export default ApiRoute;
