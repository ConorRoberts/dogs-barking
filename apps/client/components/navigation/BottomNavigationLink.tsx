import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
}

const BottomNavigationLink = ({ href, children }: Props) => {
  return (
    <Link href={href} passHref className="small-screen-nav-button">
      {children}
    </Link>
  );
};

export default BottomNavigationLink;
