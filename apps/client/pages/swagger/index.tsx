import { GetStaticProps } from "next";

// import { createSwaggerSpec } from "next-swagger-doc";
// import SwaggerUI from "swagger-ui-react";
// import "swagger-ui-react/swagger-ui.css";

const Page = () => {
  // return <SwaggerUI spec={spec} />;
  return <div>Hello</div>;
};

export const getStaticProps: GetStaticProps = () => {
  // const spec: Record<string, any> = createSwaggerSpec({
  //   schemaFolders: ["schemas"],
  //   definition: {
  //     openapi: "3.0.0",
  //     info: {
  //       title: "Dogs Barking API Spec",
  //     },
  //   },
  // });
  return {
    props: {},
  };
};

export default Page;
