import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const FeatureGridItem: FC<Props> = ({ children }) => {
  return <div className="dark:border-gray-800 border rounded-md py-12 px-4 flex flex-col gap-4 w-80">{children}</div>;
};

export default FeatureGridItem;
