import ApiRoute from "~/types/ApiRoute";

const routes: ApiRoute[] = [
  {
    path: "/course",
    methods: [
      {
        method: "GET",
        desc: "Gets all existing courses",
        output: [
          {
            id: "CIS1500",
            description: "CIS1500",
          },
        ],
        input: {},
      },
    ],
  },
  {
    path: "/course/search",
    methods: [
      {
        method: "GET",
        desc: "Gets courses based on search parameters",
        input: {},
        output: {},
      },
    ],
  },
  {
    path: "/course/:id",
    methods: [
      {
        method: "GET",
        desc: "Gets a specific course based on id",
        input: {},
        output: {},
      },
    ],
  },
  {
    path: "/program/search",
    methods: [
      {
        method: "GET",
        desc: "Gets programs based on search parameters",
        input: {},
        output: {},
      },
    ],
  },
  {
    path: "/program/:id",
    methods: [
      {
        method: "GET",
        desc: "Gets a specific program based on id",
        input: {},
        output: {},
      },
    ],
  },
];

export default routes;
