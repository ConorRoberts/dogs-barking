import Link from "next/link";

interface Props {
  href: string;
  text: string;
}

const TopNavigationLink = ({ href, text }: Props) => {
  return (
    <Link href={href} className="big-screen-nav-button">
      {text}
    </Link>
  );
};

export default TopNavigationLink;
