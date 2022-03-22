import { GetStaticProps } from "next";

import { createSwaggerSpec } from "next-swagger-doc";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const Page = ({ spec }) => {
  return <SwaggerUI spec={spec} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    schemaFolders: ["schemas"],
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Dogs Barking API Spec",
      },
    },
  });
  return {
    props: {
      spec,
    },
  };
};

export default Page;
