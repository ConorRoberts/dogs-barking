import CreatorCard from "@components/CreatorCard";
import MetaData from "@components/MetaData";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <MetaData title="About" />
      <h1 className="text-center">About</h1>

      <h3 className="text-center">Creators</h3>

      <div className="w-full mx-auto max-w-6xl flex flex-row gap-4 justify-center md:items-stretch flex-wrap">
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
        <CreatorCard
          image={"/creators/Ben.jpg"}
          name="Ben Carlson"
          role="Full-Stack Developer"
          githubUrl="https://github.com/BCarlson1512"
          linkedinUrl="https://www.linkedin.com/in/bencarlson1512/"
        />
      </div>
    </div>
  );
};

export default Page;
