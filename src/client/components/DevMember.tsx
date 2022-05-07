import React from "react";
import Image from "next/image";

interface DevMemberProps {
  name: string;
  role: string;
  email: string;
  imagePath: string;
  alt: string;
}

const DevMember = (props: DevMemberProps) => {
  const { name, role, email, imagePath, alt } = props;

  return (
    <div className="px-4 flex flex-col sm:flex-row gap-8 py-4 bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 sm:rounded-full rounded-xl items-center w-72 sm:w-auto">
      <div className="relative w-36 h-36 rounded-full overflow-hidden">
        <Image src={imagePath} alt={alt} objectFit="cover" layout="fill" priority={true} />
      </div>
      <div className="flex flex-col gap-4 pt-2 justify-center">
        <p className="text-left text-2xl font-light">{name}</p>
        <p>{role}</p>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default DevMember;
