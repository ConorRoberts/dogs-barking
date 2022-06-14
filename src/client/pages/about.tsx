import CreatorCard from "@components/CreatorCard";
import MetaData from "@components/MetaData";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <MetaData title="About" />
      <h1 className="text-center">About</h1>

      <h3 className="text-center">Creators</h3>

      <div className="w-full mx-auto max-w-2xl grid sm:grid-cols-2 gap-4 justify-center justify-items-center">
        <CreatorCard
          image={"/creators/Conor.jpg"}
          name="Conor Roberts"
          role="Full-Stack Web Developer"
          githubUrl="https://github.com/conorroberts"
          linkedinUrl="https://www.linkedin.com/in/conorjroberts/"
        />
        <CreatorCard
          image={"/creators/Josh.jpeg"}
          name="Josh Ryan Macadangdang"
          role="UI/UX Designer"
          linkedinUrl="https://www.linkedin.com/in/josh-ryan-macadangdang-60662b1ba/"
        />
      </div>
    </div>
  );
};

export default Page;
