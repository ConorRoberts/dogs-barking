import React, { ReactNode } from "react";
import Head from "next/head";
import { APP_NAME } from "@config/config";

export interface MetaDataProps {
  title: string;
  children?: ReactNode;
  description?: string;
}

/**
 * Component for giving metadata to a given page.
 * @param param0
 * @returns
 */
const MetaData = ({ title, description, ...props }: MetaDataProps) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <link rel="manifest" href="/manifest.json" />
      <link href="/icons/icon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
      <link href="/icons/icon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/icons/icon-180x180.png"></link>
      <title>{`${title} - ${APP_NAME}`}</title>
      <meta property="og:title" content={`${title} - ${APP_NAME}`} />
      <meta property="og:description" content={description} />
      {props?.children && props.children}
    </Head>
  );
};

export default MetaData;
