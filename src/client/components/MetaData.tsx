import React, { ReactNode } from "react";
import Head from "next/head";
import { APP_NAME } from "@config/config";

export interface MetaDataProps {
    title: string;
    children?: ReactNode;
}

/**
 * Component for giving metadata to a given page.
 * @param param0
 * @returns
 */
const MetaData = ({ title, ...props }: MetaDataProps) => {
  return (
    <Head>
      <title>{`${title} - ${APP_NAME}`}</title>
      {props?.children && props.children}
    </Head>
  );
};

export default MetaData;
