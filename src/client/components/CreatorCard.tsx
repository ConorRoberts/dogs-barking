import Image from "next/image";
import { GitHubIcon, LinkedInIcon } from "./Icons";

interface Props {
  image: string;
  name: string;
  role: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

const CreatorCard = (props: Props) => {
  const { image, name, role, githubUrl, linkedinUrl, email } = props;
  return (
    <div className="dark:bg-gray-800 rounded-xl p-2 flex flex-col w-72 gap-4">
      <div className="relative rounded-full overflow-hidden w-48 h-48 mx-auto">
        <Image src={image} layout="fill" objectFit="cover" alt={`${name}'s face`} />
      </div>

      <div className="text-center">
        <h3>{name}</h3>
        <p className="text-sm dark:text-gray-300">{role}</p>
      </div>

      <div className="flex justify-center gap-4">
        {githubUrl && (
          <a className="primary-hover" href={githubUrl}>
            <GitHubIcon size={25} />
          </a>
        )}
        {linkedinUrl && (
          <a className="primary-hover" href={linkedinUrl}>
            <LinkedInIcon size={25} />
          </a>
        )}
      </div>
    </div>
  );
};

export default CreatorCard;
