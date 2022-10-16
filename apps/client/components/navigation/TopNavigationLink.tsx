import Link from "next/link";

interface Props {
  href: string;
  text: string;
}

const TopNavigationLink = ({ href, text }: Props) => {
  return (
    <Link href={href} passHref>
      <a className="big-screen-nav-button">{text}</a>
    </Link>
  );
};

export default TopNavigationLink;
