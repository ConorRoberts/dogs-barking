import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
}

const BottomNavigationLink = ({ href, children }: Props) => {
  return (
    <Link href={href} passHref>
      <a className="small-screen-nav-button">{children}</a>
    </Link>
  );
};

export default BottomNavigationLink;
